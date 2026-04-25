"use client";

import Link from "next/link";
import { useState } from "react";
import CameraCard from "./components/CameraCard";
import PromptPanel from "./components/PromptPanel";
import CommandLog from "./components/CommandLog";
import ControlPanel from "./components/ControlPanel";
import NLPPrediction from "./components/NLPPrediction";

export default function Dashboard() {
  const [predictions, setPredictions] = useState<string[]>([]);

  return (
    <main className="relative h-screen bg-linear-to-br from-[#8E98B0] via-[#8892A9] to-[#4F5562] p-6">
      <Link
        href="/sandbox"
        className="absolute right-6 top-6 z-10 rounded-lg bg-gray-800/80 px-3 py-2 text-sm font-medium text-gray-100 shadow hover:bg-gray-700/90"
      >
        Open sandbox
      </Link>
      <div className="grid h-full grid-cols-[3fr_1fr] grid-rows-[2fr_1fr] gap-4">

        {/* Cameras */}
        <div className="grid grid-cols-2 gap-4">
          <CameraCard armName="Arm 1" armId={1} enabled />
          <CameraCard armName="Arm 2" armId={2} enabled={false} />
        </div>

        {/* NLP Prediction (replaces System Status) */}
        <NLPPrediction predictions={predictions} />

        {/* Prompt + Logs */}
        <div className="grid grid-cols-2 gap-4">
          <PromptPanel onPredictions={setPredictions} />
          <CommandLog />
        </div>

        {/* Control Panel */}
        <ControlPanel onPredictions={setPredictions} />

      </div>
    </main>
  );
}
