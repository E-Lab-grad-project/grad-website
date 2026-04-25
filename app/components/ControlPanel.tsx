"use client";

import { useState } from "react";
import ArrowControls from "./ArrowControls";
import { Gamepad2 } from "lucide-react";

type ControlPanelProps = {
  onPredictions: (predictions: string[]) => void;
};

export default function ControlPanel({ onPredictions }: ControlPanelProps) {
  const [arm, setArm] = useState<"arm1" | "arm2">("arm1");

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-3 border-[#94BBE9] bg-gray-800/80 p-4 shadow-md shadow-gray-800">
      <h2 className="mb-3 flex shrink-0 items-center gap-2 text-lg font-semibold">
        <Gamepad2 size={30} className="text-green-400" />
        Manual Control
      </h2>

      {/* Arm Selector */}
      <div className="mb-4 flex shrink-0 justify-center gap-2">
        {(["arm1", "arm2"] as const).map((a) => (
          <button
            key={a}
            onClick={() => setArm(a)}
            className={`px-4 py-1 rounded-lg text-sm transition ${
              arm === a
                ? "bg-green-400 text-black"
                : "bg-gray-700 text-gray-300 hover:bg-gray-600"
            }`}
          >
            {a.toUpperCase()}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        <ArrowControls arm={arm} onPredictions={onPredictions} />
      </div>
    </div>
  );
}
