"use client";

import { useState } from "react";
import CameraCard from "./components/CameraCard";
import PromptPanel from "./components/PromptPanel";
import CommandLog from "./components/CommandLog";
import ControlPanel from "./components/ControlPanel";
import NLPPrediction from "./components/NLPPrediction";

export default function Dashboard() {
  const [predictions, setPredictions] = useState<string[]>([]);

  return (
    <main className="bg-linear-to-br from-[#8E98B0] via-[#8892A9] to-[#4F5562]  p-6 h-screen">
      <div className="grid grid-cols-[3fr_1fr] grid-rows-[2fr_1fr] gap-4 h-full">

        {/* Cameras */}
        <div className="grid grid-cols-2 gap-4">
          <CameraCard armName="Arm 1" />
          <CameraCard armName="Arm 2" />
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
