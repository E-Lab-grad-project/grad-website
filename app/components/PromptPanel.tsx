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
    } catch {
      setError("Failed to reach NLP server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-full min-h-0 flex-col rounded-2xl border-3 border-[#94BBE9] bg-gray-800/80 p-4 shadow-md shadow-gray-800">
      <label className="mb-2 flex shrink-0 items-center text-lg font-semibold">
        <MessageSquare size={30} className="pr-1 text-cyan-400" /> Command Prompt
      </label>

      <textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        placeholder="e.g. move up then move down"
        className="min-h-0 w-full flex-1 resize-none rounded-lg border border-gray-600 bg-gray-900 p-3 focus:outline-none focus:ring-2 focus:ring-[#94BBE9]/50"
      />

      {error ? <p className="mt-2 shrink-0 text-sm text-red-400">{error}</p> : null}

      <button
        type="button"
        onClick={sendPrompt}
        disabled={loading}
        className="mt-3 shrink-0 self-end rounded-lg bg-green-600 px-6 py-2 hover:bg-green-700 disabled:opacity-50"
      >
        {loading ? "Processing..." : "Send"}
      </button>
    </div>
  );
}
