"use client";

import { Brain } from "lucide-react";

type NLPPredictionProps = {
  predictions: string[]; // changed from single string
};

export default function NLPPrediction({ predictions }: NLPPredictionProps) {
  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-3 border-[#94BBE9] bg-gray-800/80 p-4 shadow-md shadow-gray-800">
      <h2 className="mb-3 flex shrink-0 items-center gap-2 font-semibold text-gray-200">
        <Brain size={30} className="text-purple-400" />
        NLP Prediction
      </h2>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {predictions && predictions.length > 0 ? (
          <ol className="list-inside list-decimal space-y-1 font-mono text-green-400">
            {predictions.map((pred, index) => (
              <li key={index}>{pred}</li>
            ))}
          </ol>
        ) : (
          <p className="text-gray-500">Waiting for command...</p>
        )}
      </div>
    </div>
  );
}
