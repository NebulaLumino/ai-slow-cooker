"use client";
import { useState } from "react";
import ReactMarkdown from "react-markdown";

const ACCENT = "bg-yellow-500";
const ACCENT_TEXT = "text-yellow-400";
const ACCENT_GLOW = "shadow-yellow-500/20";

export default function SlowCooker() {
  const [cookerSize, setCookerSize] = useState("");
  const [servings, setServings] = useState("");
  const [preferences, setPreferences] = useState("");
  const [prepTime, setPrepTime] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cookerSize || !servings || !preferences || !prepTime) {
      setError("Please fill in all fields.");
      return;
    }
    setLoading(true);
    setError("");
    setResult("");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cookerSize, servings, preferences, prepTime }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Something went wrong."); return; }
      setResult(data.result || "");
    } catch {
      setError("Failed to generate. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-950 to-gray-900 text-white flex flex-col">
      <header className="border-b border-white/10 px-6 py-5 flex items-center gap-3">
        <div className={`w-10 h-10 ${ACCENT} rounded-xl flex items-center justify-center text-xl`}>🫕</div>
        <div>
          <h1 className="text-xl font-bold text-white">AI Slow Cooker Dump Meal Planner</h1>
          <p className="text-sm text-gray-400">Set-it-and-forget-it recipes with layered order</p>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 py-10 grid grid-cols-1 lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Slow Cooker Size</label>
            <select value={cookerSize} onChange={e => setCookerSize(e.target.value)}
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-yellow-500/50 transition-colors">
              <option value="" className="bg-gray-900">Select cooker size...</option>
              <option value="2-3 quart (small)" className="bg-gray-900">2–3 Quart (small)</option>
              <option value="4-5 quart (medium)" className="bg-gray-900">4–5 Quart (medium)</option>
              <option value="6-7 quart (large)" className="bg-gray-900">6–7 Quart (large)</option>
              <option value="8+ quart (extra large)" className="bg-gray-900">8+ Quart (extra large)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Servings Needed</label>
            <input type="number" value={servings} onChange={e => setServings(e.target.value)} placeholder="e.g., 4, 6, 8"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Protein & Vegetable Preferences</label>
            <textarea value={preferences} onChange={e => setPreferences(e.target.value)} rows={3}
              placeholder="e.g., chicken thighs, black beans, sweet potatoes, bell peppers, no mushrooms..."
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors resize-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-1">Prep Time Available (minutes)</label>
            <input type="number" value={prepTime} onChange={e => setPrepTime(e.target.value)} placeholder="e.g., 15, 20, 30"
              className="w-full bg-gray-800/60 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-yellow-500/50 transition-colors" />
          </div>
          {error && <p className="text-red-400 text-sm">{error}</p>}
          <button type="submit" disabled={loading}
            className={`w-full py-3 rounded-xl font-semibold text-gray-900 transition-all ${ACCENT} hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg ${ACCENT_GLOW}`}>
            {loading ? "Planning Meal..." : "Plan Dump Meal"}
          </button>
        </form>
        <div className="flex flex-col">
          <h2 className={`text-sm font-semibold uppercase tracking-wider ${ACCENT_TEXT} mb-3`}>AI Output</h2>
          <div className="flex-1 bg-gray-800/40 border border-white/10 rounded-xl p-6 overflow-y-auto max-h-[600px]">
            {result ? (
              <div className="prose prose-invert prose-sm max-w-none">
                <ReactMarkdown>{result}</ReactMarkdown>
              </div>
            ) : (
              <p className="text-gray-500 italic">Your dump meal plan will appear here...</p>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
