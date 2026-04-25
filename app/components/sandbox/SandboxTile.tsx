"use client";

import CameraCard from "@/app/components/CameraCard";
import CommandLog from "@/app/components/CommandLog";
import ControlPanel from "@/app/components/ControlPanel";
import NLPPrediction from "@/app/components/NLPPrediction";
import PromptPanel from "@/app/components/PromptPanel";
import { getWidgetMeta } from "@/lib/sandbox/widgetRegistry";
import type { PlacedInstance } from "@/lib/sandbox/types";
import { X } from "lucide-react";

type Props = {
  instance: PlacedInstance;
  selected: boolean;
  predictions: string[];
  onPredictions: (next: string[]) => void;
  onSelect: () => void;
  onRemove: () => void;
};

function mergeProps(
  base: Record<string, unknown> | undefined,
  override: Record<string, unknown> | undefined,
): Record<string, unknown> {
  return { ...(base ?? {}), ...(override ?? {}) };
}

export default function SandboxTile({
  instance,
  selected,
  predictions,
  onPredictions,
  onSelect,
  onRemove,
}: Props) {
  const meta = getWidgetMeta(instance.typeId);
  const merged = mergeProps(meta.defaultProps, instance.props);

  return (
    <div
      role="presentation"
      className={`sandbox-tile-enter group relative flex h-full min-h-0 flex-col rounded-xl border bg-gray-900/50 shadow-inner transition duration-200 ${
        selected ? "border-blue-400 ring-2 ring-blue-400/60" : "border-gray-600/70"
      }`}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest("[data-sandbox-remove]")) return;
        onSelect();
      }}
    >
      <button
        type="button"
        data-sandbox-remove
        aria-label="Remove tile"
        className="absolute right-1 top-1 z-10 flex h-7 w-7 items-center justify-center rounded-md bg-gray-800/90 text-gray-200 opacity-0 shadow hover:bg-red-600/90 hover:text-white group-hover:opacity-100 focus:opacity-100"
        onMouseDown={(e) => e.stopPropagation()}
        onClick={(e) => {
          e.stopPropagation();
          onRemove();
        }}
      >
        <X size={16} />
      </button>

      <div className="flex h-full min-h-0 flex-1 flex-col overflow-hidden p-2 pt-8">
        {instance.typeId === "camera_arm1" || instance.typeId === "camera_arm2" ? (
          <CameraCard
            armName={String(merged.armName ?? "Arm")}
            armId={merged.armId === 1 || merged.armId === 2 ? merged.armId : 1}
            enabled={Boolean(merged.enabled ?? true)}
          />
        ) : null}

        {instance.typeId === "nlp_prediction" ? (
          <NLPPrediction predictions={predictions} />
        ) : null}

        {instance.typeId === "command_prompt" ? (
          <PromptPanel onPredictions={onPredictions} />
        ) : null}

        {instance.typeId === "command_log" ? <CommandLog /> : null}

        {instance.typeId === "control_panel" ? (
          <ControlPanel onPredictions={onPredictions} />
        ) : null}
      </div>
    </div>
  );
}
