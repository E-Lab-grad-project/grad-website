import { Terminal } from "lucide-react";


export default function CommandLog() {
  return (
        <div className="bg-gray-800/80 rounded-2xl p-4 border-3 border-[#94BBE9] shadow-md shadow-gray-800">
      <h2 className="flex items-center gap-2 font-semibold text-lg mb-3 text-gray-200">
        <Terminal size={30} className="text-cyan-400" />
        Command Log
      </h2>

      <div className="text-sm space-y-2 overflow-y-auto max-h-48">
        <p>14:01 - Command received</p>
        <p>14:01 - NLP parsing successful</p>
        <p>14:02 - Arm 1 picking object</p>
        <p>14:03 - Object transferred to Arm 2</p>
        <p className="text-green-400">14:04 - Task completed</p>
      </div>
    </div>
  );
}
