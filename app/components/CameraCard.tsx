"use client";
import { Camera } from "lucide-react";
import { useState } from "react";

export default function CameraCard({ armName }: { armName: string }) {
  const [on, setOn] = useState(false);

  return (
    <div className="bg-gray-800/80 rounded-2xl p-5 border-3 border-[#94BBE9] flex flex-col shadow-md shadow-gray-800">
      <div className="mb-2 flex justify-between items-center">
        <h2 className="flex items-center gap-2 font-semibold text-gray-200">
          <Camera size={30} className="text-blue-400" />
          {armName} Camera
        </h2>
        <span className={`text-lg ${on ? "text-green-400" : "text-red-400"}`}>
          {on ? "Online" : "Offline"}
        </span>
      </div>

      <div className="flex-1 bg-black rounded-lg flex items-center justify-center text-gray-500">
        {on ? "Camera Stream" : "Camera is off"}
      </div>

      <button
        onClick={() => setOn(!on)}
        className="mt-3 bg-gray-500/80 hover:bg-green-600 py-2 rounded-lg transition"
      >
        {on ? "Turn Off" : "Turn On"}
      </button>
    </div>
  );
}
