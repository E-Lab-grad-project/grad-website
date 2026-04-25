"use client";

import GridLayout, { verticalCompactor } from "react-grid-layout";
import type { LayoutItem } from "react-grid-layout";
import type { PlacedInstance } from "@/lib/sandbox/types";
import SandboxTile from "./SandboxTile";

export const SANDBOX_GRID_COLS = 12;
export const SANDBOX_ROW_HEIGHT = 24;

type Props = {
  width: number;
  instances: PlacedInstance[];
  layout: LayoutItem[];
  onLayoutChange: (next: LayoutItem[]) => void;
  selectedInstanceId: string | null;
  onSelectInstance: (id: string | null) => void;
  onRemoveInstance: (id: string) => void;
  predictions: string[];
  onPredictions: (next: string[]) => void;
};

export default function SandboxGrid({
  width,
  instances,
  layout,
  onLayoutChange,
  selectedInstanceId,
  onSelectInstance,
  onRemoveInstance,
  predictions,
  onPredictions,
}: Props) {
  if (width <= 0) {
    return (
      <div className="flex min-h-[320px] flex-1 items-center justify-center rounded-2xl border border-dashed border-gray-500/60 bg-gray-900/30 text-gray-400">
        Preparing grid…
      </div>
    );
  }

  return (
    <div className="w-full min-w-0 max-w-full">
    <GridLayout
      className="sandbox-grid layout"
      width={width}
      layout={layout}
      gridConfig={{
        cols: SANDBOX_GRID_COLS,
        rowHeight: SANDBOX_ROW_HEIGHT,
        margin: [10, 10],
        containerPadding: [0, 0],
        maxRows: Infinity,
      }}
      compactor={verticalCompactor}
      dragConfig={{
        cancel:
          "input,textarea,button,select,option,video,a,[data-sandbox-remove],[data-sandbox-no-drag]",
        threshold: 6,
      }}
      onLayoutChange={(next) => onLayoutChange([...next])}
    >
      {instances.map((inst) => (
        <div
          key={inst.instanceId}
          className="h-full min-h-0 overflow-hidden rounded-xl bg-transparent"
        >
          <SandboxTile
            instance={inst}
            selected={selectedInstanceId === inst.instanceId}
            predictions={predictions}
            onPredictions={onPredictions}
            onSelect={() => onSelectInstance(inst.instanceId)}
            onRemove={() => onRemoveInstance(inst.instanceId)}
          />
        </div>
      ))}
    </GridLayout>
    </div>
  );
}
