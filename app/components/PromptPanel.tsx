"use client";
import { MessageSquare } from "lucide-react";
import { useState } from "react";

type PromptPanelProps = {
  onPredictions: (predictions: string[]) => void; // change to accept array
};

// ✅ Helper function to split compound commands
function splitCommands(input: string): string[] {
  return input
    .toLowerCase()
    .split(/\b(?:then|and)\b|,/g)
    .map(cmd => cmd.trim())
    .filter(cmd => cmd.length > 0);
}

export default function PromptPanel({ onPredictions }: PromptPanelProps) {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const sendPrompt = async () => {
    if (!prompt.trim()) return;

    const commands = splitCommands(prompt);

    if (commands.length === 0) {
      setError("No valid commands detected");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("http://localhost:8000/predict", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          texts: commands, // ✅ list of commands
        }),
      });

      if (!res.ok) throw new Error("Request failed");

        const data = await res.json();

        // Example: { predictions: ["move_up", "move_down"] }
        if (data.predictions && data.predictions.length > 0) {
          onPredictions(data.predictions); // send entire array
        }

      setPrompt("");
    } catch (err) {
      setError("Failed to reach NLP server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-800/80 rounded-2xl p-4 border-3 border-[#94BBE9] flex flex-col shadow-md shadow-gray-800 ">
      <label className="flex items-center mb-2 font-semibold text-lg">  <MessageSquare size={30} className="text-cyan-400 pr-1" /> Command Prompt </label>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. move up then move down"
        className="h-28 resize-none bg-gray-900 rounded-lg p-3 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-[#94BBE9]/50"
      />

      {error && <p className="text-red-400 text-sm mt-2">{error}</p>}

      <button
        onClick={sendPrompt}
        disabled={loading}
        className="mt-3 self-end bg-green-600 hover:bg-green-700 px-6 py-2 rounded-lg disabled:opacity-50"
      >
        {loading ? "Processing..." : "Send"}
      </button>
    </div>
  );
}
