import { Brain } from "lucide-react";

type NLPPredictionProps = {
  predictions: string[]; // changed from single string
};

export default function NLPPrediction({ predictions }: NLPPredictionProps) {
  return (
    <div className="bg-gray-800/80 rounded-2xl p-4 border-3 border-[#94BBE9] shadow-md shadow-gray-800">
      <h2 className="flex items-center gap-2 font-semibold mb-3 text-gray-200">
        <Brain size={30} className="text-purple-400" />
        NLP Prediction
      </h2>

      {predictions && predictions.length > 0 ? (
        <ol className="list-decimal list-inside space-y-1 text-green-400 font-mono">
          {predictions.map((pred, index) => (
            <li key={index}>{pred}</li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500">Waiting for command...</p>
      )}
    </div>
  );
}
