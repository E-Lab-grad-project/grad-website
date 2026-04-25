"use client";

import {
  DndContext,
  PointerSensor,
  pointerWithin,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  useCallback,
  useEffect,
  useReducer,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { LayoutItem } from "react-grid-layout";
import { clampLayoutToCols, findFirstFreeSlot } from "@/lib/sandbox/layoutUtils";
import { newInstanceId } from "@/lib/sandbox/id";
import { reconcileSandbox } from "@/lib/sandbox/reconcile";
import type { PlacedInstance, SandboxState, WidgetTypeId } from "@/lib/sandbox/types";
import { WIDGET_TYPES } from "@/lib/sandbox/types";
import { getWidgetMeta } from "@/lib/sandbox/widgetRegistry";
import Palette from "./Palette";
import SandboxGrid, { SANDBOX_GRID_COLS } from "./SandboxGrid";

const SANDBOX_DROP_ID = "sandbox-canvas";
const STORAGE_KEY = "grad-sandbox-v1";

type Action =
  | { type: "ADD"; typeId: WidgetTypeId }
  | { type: "REMOVE"; instanceId: string }
  | { type: "SET_LAYOUT"; layout: LayoutItem[] }
  | { type: "RESET" }
  | { type: "HYDRATE"; payload: SandboxState };

function isWidgetTypeId(v: string): v is WidgetTypeId {
  return (WIDGET_TYPES as readonly string[]).includes(v);
}

function sandboxReducer(state: SandboxState, action: Action): SandboxState {
  switch (action.type) {
    case "ADD": {
      const meta = getWidgetMeta(action.typeId);
      const instanceId = newInstanceId();
      const { x, y } = findFirstFreeSlot(
        state.layout,
        SANDBOX_GRID_COLS,
        meta.defaultW,
        meta.defaultH,
      );
      const item: LayoutItem = {
        i: instanceId,
        x,
        y,
        w: meta.defaultW,
        h: meta.defaultH,
        minW: meta.minW,
        minH: meta.minH,
      };
      return {
        instances: [...state.instances, { instanceId, typeId: action.typeId, props: {} }],
        layout: clampLayoutToCols([...state.layout, item], SANDBOX_GRID_COLS),
      };
    }
    case "REMOVE": {
      return {
        instances: state.instances.filter((i) => i.instanceId !== action.instanceId),
        layout: state.layout.filter((l) => l.i !== action.instanceId),
      };
    }
    case "SET_LAYOUT": {
      return {
        ...state,
        layout: clampLayoutToCols(action.layout, SANDBOX_GRID_COLS),
      };
    }
    case "RESET": {
      return { instances: [], layout: [] };
    }
    case "HYDRATE": {
      return {
        instances: action.payload.instances,
        layout: clampLayoutToCols(action.payload.layout, SANDBOX_GRID_COLS),
      };
    }
    default:
      return state;
  }
}

function loadPersistedState(): SandboxState | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object") return null;
    const rec = parsed as Record<string, unknown>;
    const instances = rec.instances;
    const layout = rec.layout;
    if (!Array.isArray(instances) || !Array.isArray(layout)) return null;

    const safeInstances: PlacedInstance[] = [];
    for (const row of instances) {
      if (!row || typeof row !== "object") continue;
      const o = row as Record<string, unknown>;
      if (typeof o.instanceId !== "string" || typeof o.typeId !== "string") continue;
      if (!isWidgetTypeId(o.typeId)) continue;
      const props =
        o.props && typeof o.props === "object" ? (o.props as Record<string, unknown>) : undefined;
      safeInstances.push({
        instanceId: o.instanceId,
        typeId: o.typeId,
        props,
      });
    }

    const ids = new Set(safeInstances.map((i) => i.instanceId));
    const safeLayout: LayoutItem[] = [];
    for (const row of layout) {
      if (!row || typeof row !== "object") continue;
      const l = row as LayoutItem;
      if (typeof l.i !== "string" || !ids.has(l.i)) continue;
      if (
        typeof l.x !== "number" ||
        typeof l.y !== "number" ||
        typeof l.w !== "number" ||
        typeof l.h !== "number"
      ) {
        continue;
      }
      safeLayout.push(l);
    }

    return { instances: safeInstances, layout: safeLayout };
  } catch {
    return null;
  }
}

function CanvasDropZone({
  children,
}: {
  children: (opts: {
    setNodeRef: (el: HTMLElement | null) => void;
    isOver: boolean;
  }) => ReactNode;
}) {
  const { setNodeRef, isOver } = useDroppable({ id: SANDBOX_DROP_ID });
  return <>{children({ setNodeRef, isOver })}</>;
}

export default function SandboxBuilder() {
  const [state, dispatch] = useReducer(sandboxReducer, {
    instances: [],
    layout: [],
  } satisfies SandboxState);
  const [hydrated, setHydrated] = useState(false);
  const [gridWidth, setGridWidth] = useState(0);
  const [selectedInstanceId, setSelectedInstanceId] = useState<string | null>(null);
  const [predictions, setPredictions] = useState<string[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const derived = reconcileSandbox(state.instances);

  useEffect(() => {
    queueMicrotask(() => {
      const loaded = loadPersistedState();
      if (loaded) dispatch({ type: "HYDRATE", payload: loaded });
      setHydrated(true);
    });
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota / private mode
    }
  }, [state, hydrated]);

  const measureWidth = useCallback(() => {
    const el = containerRef.current;
    if (!el) return;
    setGridWidth(el.clientWidth);
  }, []);

  useEffect(() => {
    measureWidth();
    const ro = typeof ResizeObserver !== "undefined" ? new ResizeObserver(() => measureWidth()) : null;
    const el = containerRef.current;
    if (el && ro) ro.observe(el);
    window.addEventListener("resize", measureWidth);
    return () => {
      window.removeEventListener("resize", measureWidth);
      if (el && ro) ro.unobserve(el);
    };
  }, [measureWidth]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 6 },
    }),
  );

  const onDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || over.id !== SANDBOX_DROP_ID) return;
    const typeId = active.data.current?.typeId as WidgetTypeId | undefined;
    if (!typeId || !isWidgetTypeId(typeId)) return;
    dispatch({ type: "ADD", typeId });
  };

  const setDropAndMeasureRef = (node: HTMLDivElement | null, setNodeRef: (el: HTMLElement | null) => void) => {
    setNodeRef(node);
    containerRef.current = node;
    queueMicrotask(() => measureWidth());
  };

  return (
    <DndContext sensors={sensors} collisionDetection={pointerWithin} onDragEnd={onDragEnd}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <header className="sandbox-enter-header flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-gray-600/70 bg-gray-900/50 px-4 py-3 shadow-lg shadow-black/10 backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-black/15">
          <div>
            <h1 className="text-xl font-semibold text-gray-100">Sandbox</h1>
            <p className="text-sm text-gray-400">
              Drag widgets from the palette. Layout persists in this browser.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {derived.issues.length > 0 ? (
              <span className="max-w-md animate-pulse text-xs text-amber-300 motion-reduce:animate-none">
                {derived.issues.join(" ")}
              </span>
            ) : null}
            <button
              type="button"
              className="rounded-lg bg-gray-700 px-3 py-2 text-sm text-gray-100 transition hover:bg-gray-600 active:scale-[0.98]"
              onClick={() => {
                dispatch({ type: "RESET" });
                setSelectedInstanceId(null);
                setPredictions([]);
              }}
            >
              Reset layout
            </button>
          </div>
        </header>

        <div className="flex min-h-0 flex-1 gap-4">
          <Palette />

          <CanvasDropZone>
            {({ setNodeRef, isOver }) => (
              <div
                ref={(node) => setDropAndMeasureRef(node, setNodeRef)}
                className={`sandbox-enter-canvas relative flex min-h-0 min-w-0 flex-1 flex-col overflow-y-auto overflow-x-hidden rounded-2xl border border-dashed p-3 transition-colors ${
                  isOver
                    ? "sandbox-drop-over border-blue-400/90 bg-blue-500/10"
                    : "border-gray-500/60 bg-gray-900/25"
                }`}
                onMouseDown={(e) => {
                  const t = e.target as HTMLElement;
                  if (!t.closest(".react-grid-item")) setSelectedInstanceId(null);
                }}
              >
                {state.instances.length === 0 ? (
                  <div className="sandbox-empty-hint pointer-events-none absolute inset-0 flex items-center justify-center px-6 text-center text-sm font-medium tracking-wide text-gray-500">
                    Drop widgets here to build your layout.
                  </div>
                ) : null}

                <SandboxGrid
                  width={gridWidth}
                  instances={state.instances}
                  layout={state.layout}
                  onLayoutChange={(next) =>
                    dispatch({ type: "SET_LAYOUT", layout: [...next] })
                  }
                  selectedInstanceId={selectedInstanceId}
                  onSelectInstance={setSelectedInstanceId}
                  onRemoveInstance={(id) => {
                    dispatch({ type: "REMOVE", instanceId: id });
                    setSelectedInstanceId((cur) => (cur === id ? null : cur));
                  }}
                  predictions={predictions}
                  onPredictions={setPredictions}
                />
              </div>
            )}
          </CanvasDropZone>
        </div>
      </div>
    </DndContext>
  );
}
