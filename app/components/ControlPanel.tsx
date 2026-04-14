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
    <div className="bg-gray-800/80 rounded-2xl p-4 border-3 border-[#94BBE9] shadow-md shadow-gray-800">
      <h2 className="flex items-center gap-2 font-semibold text-lg mb-3">
        <Gamepad2 size={30} className="text-green-400" />
        Manual Control
      </h2>

      {/* Arm Selector */}
      <div className="flex gap-2 justify-center mb-4">
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

      {/* ✅ Pass predictions callback */}
      <ArrowControls arm={arm} onPredictions={onPredictions} />
    </div>
  );
}
