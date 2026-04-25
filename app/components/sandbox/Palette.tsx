"use client";

import { useDraggable } from "@dnd-kit/core";
import { listPaletteWidgets } from "@/lib/sandbox/widgetRegistry";
import type { WidgetTypeId } from "@/lib/sandbox/types";
import { GripVertical } from "lucide-react";

function PaletteItem({
  typeId,
  label,
  description,
  index,
}: {
  typeId: WidgetTypeId;
  label: string;
  description: string;
  index: number;
}) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `palette:${typeId}`,
    data: { typeId },
  });

  const dragStyle = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` as const }
    : {};

  return (
    <div
      ref={setNodeRef}
      style={{
        ...dragStyle,
        animationDelay: `${80 + index * 45}ms`,
      }}
      className={`sandbox-palette-item sandbox-palette-stagger flex cursor-grab items-start gap-2 rounded-xl border border-gray-600/80 bg-gray-800/90 p-3 text-left shadow-md active:cursor-grabbing ${
        isDragging ? "sandbox-palette-item-dragging z-50 opacity-95" : ""
      }`}
      {...listeners}
      {...attributes}
    >
      <GripVertical className="mt-0.5 shrink-0 text-gray-400" size={18} />
      <div className="min-w-0">
        <div className="font-medium text-gray-100">{label}</div>
        <div className="text-xs text-gray-400">{description}</div>
      </div>
    </div>
  );
}

export default function Palette() {
  const items = listPaletteWidgets();

  return (
    <aside className="sandbox-enter-palette flex w-64 shrink-0 flex-col gap-3 rounded-2xl border border-gray-600/70 bg-gray-900/60 p-4 shadow-lg backdrop-blur-sm transition-shadow hover:shadow-xl hover:shadow-black/20">
      <div>
        <h2 className="text-lg font-semibold text-gray-100">Widgets</h2>
        <p className="text-xs text-gray-400">Drag into the sandbox.</p>
      </div>
      <div className="flex flex-col gap-2 overflow-y-auto pr-1">
        {items.map((w, i) => (
          <PaletteItem
            key={w.id}
            index={i}
            typeId={w.id}
            label={w.label}
            description={w.description}
          />
        ))}
      </div>
    </aside>
  );
}
