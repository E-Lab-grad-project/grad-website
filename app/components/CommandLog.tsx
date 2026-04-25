"use client";

import { Terminal } from "lucide-react";


export default function CommandLog() {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-3 border-[#94BBE9] bg-gray-800/80 p-4 shadow-md shadow-gray-800">
      <h2 className="mb-3 flex shrink-0 items-center gap-2 text-lg font-semibold text-gray-200">
        <Terminal size={30} className="text-cyan-400" />
        Command Log
      </h2>

      <div className="min-h-0 flex-1 space-y-2 overflow-y-auto text-sm">
        <p>14:01 - Command received</p>
        <p>14:01 - NLP parsing successful</p>
        <p>14:02 - Arm 1 picking object</p>
        <p>14:03 - Object transferred to Arm 2</p>
        <p className="text-green-400">14:04 - Task completed</p>
      </div>
    </div>
  );
}
