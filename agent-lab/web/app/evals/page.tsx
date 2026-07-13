"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface EvalRecord {
  id: string;
  created_at: string;
  run_id: string;
  query: string;
  expected_route: string;
  actual_route: string;
  routing_match: boolean;
  judge_score: float;
  judge_reason: string;
  raw_response: string;
}

export default function EvalsPage() {
  const [history, setHistory] = useState<EvalRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [running, setRunning] = useState(false);
  
  // Group test records by run_id
  const [selectedRunId, setSelectedRunId] = useState<string | null>(null);

  const fetchHistory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/evals/history");
      if (!res.ok) {
        throw new Error(`Failed to load evals history: HTTP ${res.status}`);
      }
      const data = await res.json();
      setHistory(data);
      if (data.length > 0 && !selectedRunId) {
        setSelectedRunId(data[0].run_id);
      }
    } catch (err: any) {
      console.error("Error loading evals:", err);
      setError(err.message || "Failed to load evaluation runs.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const triggerEvals = async () => {
    if (running) return;
    setRunning(true);
    try {
      const res = await fetch("http://localhost:8000/evals/run", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`Execution failed: HTTP ${res.status}`);
      }
      alert("Golden Evaluation Suite completed successfully!");
      await fetchHistory();
    } catch (err: any) {
      alert("Error executing evaluations: " + err.message);
    } finally {
      setRunning(false);
    }
  };

  // Group records
  const runsMap: Record<string, EvalRecord[]> = {};
  history.forEach(h => {
    if (!runsMap[h.run_id]) {
      runsMap[h.run_id] = [];
    }
    runsMap[h.run_id].push(h);
  });

  const uniqueRunIds = Object.keys(runsMap).sort((a, b) => b.localeCompare(a));
  const activeRecords = selectedRunId ? runsMap[selectedRunId] : [];

  // Metrics calculations
  const totalCases = activeRecords.length;
  const matchCases = activeRecords.filter(r => r.routing_match).length;
  const avgScore = totalCases > 0 
    ? (activeRecords.reduce((sum, r) => sum + r.judge_score, 0) / totalCases) * 100 
    : 0;
  const routeAccuracy = totalCases > 0 ? (matchCases / totalCases) * 100 : 0;

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/40 sticky top-0 z-10 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            VIZIER Golden Evals
          </span>
          <span className="px-2 py-0.5 bg-slate-900 text-slate-500 rounded text-xxs font-mono border border-slate-850">
            OBSERVABILITY
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-slate-400 hover:text-slate-200">Chat</Link>
          <Link href="/approvals" className="text-slate-400 hover:text-slate-200">Approvals</Link>
          <Link href="/briefings" className="text-slate-400 hover:text-slate-200">Briefings</Link>
          <Link href="/evals" className="text-indigo-400 hover:text-indigo-300">Evals</Link>
          <Link href="/audit" className="text-slate-400 hover:text-slate-200">Audit Logs</Link>
          <Link href="/settings" className="text-slate-400 hover:text-slate-200">Settings</Link>
        </div>
      </nav>

      {/* Main Dual-Column Panel */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Column: Runs List */}
        <section className="w-full md:w-80 flex flex-col bg-slate-950/60 border border-slate-900 rounded-xl p-4 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">
              Evaluation Runs
            </h3>
            <button
              onClick={fetchHistory}
              className="text-xxs text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Refresh
            </button>
          </div>

          <button
            onClick={triggerEvals}
            disabled={running}
            className="w-full py-2 mb-4 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 text-white text-xs font-bold rounded-lg cursor-pointer transition text-center"
          >
            {running ? "⚡ Executing Evals..." : "⚡ Run Golden Suite"}
          </button>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading && uniqueRunIds.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12">Loading evals history...</div>
            ) : uniqueRunIds.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12">No evaluation runs recorded. Click run above!</div>
            ) : (
              uniqueRunIds.map(runId => {
                const isSelected = selectedRunId === runId;
                const date = new Date(runsMap[runId][0].created_at);
                const avgRunScore = (runsMap[runId].reduce((sum, r) => sum + r.judge_score, 0) / runsMap[runId].length) * 100;
                return (
                  <button
                    key={runId}
                    onClick={() => setSelectedRunId(runId)}
                    className={`w-full text-left p-3 rounded-lg border transition cursor-pointer flex flex-col gap-1.5 ${
                      isSelected
                        ? "bg-slate-900/60 border-slate-700 text-slate-100"
                        : "bg-slate-950/40 border-slate-900/60 text-slate-400 hover:bg-slate-900/20 hover:border-slate-850"
                    }`}
                  >
                    <span className="text-xxs font-mono text-slate-500">{date.toLocaleString()}</span>
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xs font-semibold">Run ID: {runId.substring(4)}</span>
                      <span className={`text-[10px] font-bold ${
                        avgRunScore >= 80 ? "text-emerald-450" : avgRunScore >= 50 ? "text-amber-450" : "text-rose-405"
                      }`}>
                        {Math.round(avgRunScore)}% Score
                      </span>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Run Details & Metrics */}
        <section className="flex-1 bg-slate-950/60 border border-slate-900 rounded-xl p-6 flex flex-col justify-between h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] overflow-hidden">
          {!selectedRunId ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              Select an evaluation run from the list to display results.
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Header metrics */}
              <div className="grid grid-cols-3 gap-4 mb-6 shrink-0">
                <div className="bg-slate-900/40 border border-slate-900/80 p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Average Judge Score</span>
                  <span className={`text-xl font-bold font-mono ${
                    avgScore >= 80 ? "text-emerald-400" : avgScore >= 50 ? "text-amber-400" : "text-rose-400"
                  }`}>
                    {Math.round(avgScore)}%
                  </span>
                </div>
                <div className="bg-slate-900/40 border border-slate-900/80 p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Routing Accuracy</span>
                  <span className={`text-xl font-bold font-mono ${
                    routeAccuracy >= 80 ? "text-indigo-400" : "text-amber-400"
                  }`}>
                    {Math.round(routeAccuracy)}%
                  </span>
                </div>
                <div className="bg-slate-900/40 border border-slate-900/80 p-4 rounded-xl flex flex-col gap-1">
                  <span className="text-xxs font-bold text-slate-500 uppercase tracking-wider">Total Test Cases</span>
                  <span className="text-xl font-bold font-mono text-slate-200">
                    {totalCases}
                  </span>
                </div>
              </div>

              {/* Tests Breakdown */}
              <div className="flex-1 overflow-y-auto space-y-4 pr-1">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-450 border-b border-slate-900 pb-2 mb-4">
                  Test Case Breakdown
                </h4>
                {activeRecords.map((r, idx) => (
                  <div 
                    key={r.id}
                    className="p-4 bg-slate-900/10 border border-slate-900 rounded-xl space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-900/40 pb-2">
                      <span className="text-xs font-bold text-slate-200">Test #{idx+1}: "{r.query}"</span>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                          r.routing_match
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                        }`}>
                          {r.routing_match ? "Route Match" : `Expected: ${r.expected_route} | Got: ${r.actual_route}`}
                        </span>
                        <span className={`px-2 py-0.5 text-[9px] font-bold rounded ${
                          r.judge_score >= 0.8
                            ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                            : r.judge_score >= 0.5
                            ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                            : "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                        }`}>
                          Judge: {r.judge_score * 100}%
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div>
                        <span className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Judge Reason</span>
                        <p className="text-slate-350 bg-slate-950/40 p-3 rounded-lg border border-slate-900/60 leading-relaxed min-h-16 select-text">
                          {r.judge_reason}
                        </p>
                      </div>
                      <div>
                        <span className="block text-xxs font-bold text-slate-500 uppercase tracking-wider mb-1">Agent Final Response</span>
                        <div className="text-slate-350 bg-slate-950/40 p-3 rounded-lg border border-slate-900/60 font-mono text-xxs overflow-x-auto whitespace-pre-wrap max-h-24 select-text">
                          {r.raw_response || "No response text captured."}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
