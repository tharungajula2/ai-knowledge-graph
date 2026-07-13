"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { renderMarkdown } from "@/lib/markdown";

interface Briefing {
  id: string;
  created_at: string;
  kind: "morning_briefing" | "weekly_review";
  summary: string;
  raw_data: any;
}

export default function BriefingsPage() {
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [triggeringBriefing, setTriggeringBriefing] = useState(false);
  const [triggeringWeekly, setTriggeringWeekly] = useState(false);

  const fetchBriefings = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:8000/briefings");
      if (!res.ok) {
        throw new Error(`Failed to load briefings: HTTP ${res.status}`);
      }
      const data = await res.json();
      setBriefings(data);
      if (data.length > 0 && !selectedBriefing) {
        setSelectedBriefing(data[0]);
      }
    } catch (err: any) {
      console.error("Error loading briefings:", err);
      setError(err.message || "Failed to load briefings. Is the backend running at localhost:8000?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBriefings();
  }, []);

  const handleTriggerBriefing = async () => {
    if (triggeringBriefing) return;
    setTriggeringBriefing(true);
    try {
      const res = await fetch("http://localhost:8000/jobs/briefing/run-now", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`Trigger failed: HTTP ${res.status}`);
      }
      const data = await res.json();
      alert("Morning Briefing triggered and compiled successfully!");
      // Reload briefings list
      await fetchBriefings();
    } catch (err: any) {
      alert("Error triggering morning briefing: " + err.message);
    } finally {
      setTriggeringBriefing(false);
    }
  };

  const handleTriggerWeekly = async () => {
    if (triggeringWeekly) return;
    setTriggeringWeekly(true);
    try {
      const res = await fetch("http://localhost:8000/jobs/weekly/run-now", {
        method: "POST",
      });
      if (!res.ok) {
        throw new Error(`Trigger failed: HTTP ${res.status}`);
      }
      alert("Weekly Review triggered and compiled successfully!");
      await fetchBriefings();
    } catch (err: any) {
      alert("Error triggering weekly review: " + err.message);
    } finally {
      setTriggeringWeekly(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return d.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/40 sticky top-0 z-10 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            VIZIER Proactive Briefings
          </span>
          <span className="px-2 py-0.5 bg-slate-900 text-slate-500 rounded text-xxs font-mono border border-slate-850">
            PROACTIVE
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/" className="text-slate-400 hover:text-slate-200">Chat</Link>
          <Link href="/approvals" className="text-slate-400 hover:text-slate-200">Approvals</Link>
          <Link href="/briefings" className="text-indigo-400 hover:text-indigo-300">Briefings</Link>
          <Link href="/audit" className="text-slate-400 hover:text-slate-200">Audit Logs</Link>
          <Link href="/settings" className="text-slate-400 hover:text-slate-200">Settings</Link>
        </div>
      </nav>

      {/* Main Dual-Column Panel */}
      <div className="flex-1 max-w-7xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Column: Briefings List */}
        <section className="w-full md:w-96 flex flex-col bg-slate-950/60 border border-slate-900 rounded-xl p-4 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
          <div className="flex items-center justify-between mb-4 pb-2 border-b border-slate-900">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450">
              Briefings Inbox
            </h3>
            <button
              onClick={fetchBriefings}
              className="text-xxs text-indigo-400 hover:text-indigo-300 cursor-pointer"
            >
              Refresh
            </button>
          </div>

          {/* Trigger controls */}
          <div className="grid grid-cols-2 gap-2 mb-4">
            <button
              onClick={handleTriggerBriefing}
              disabled={triggeringBriefing}
              className="px-3 py-2 bg-indigo-600/10 text-indigo-400 hover:bg-indigo-600/20 disabled:bg-slate-900 border border-indigo-500/20 text-xxs font-bold rounded-lg cursor-pointer transition text-center"
            >
              {triggeringBriefing ? "Triggering..." : "⚡ Run Morning Brief"}
            </button>
            <button
              onClick={handleTriggerWeekly}
              disabled={triggeringWeekly}
              className="px-3 py-2 bg-violet-600/10 text-violet-400 hover:bg-violet-600/20 disabled:bg-slate-900 border border-violet-500/20 text-xxs font-bold rounded-lg cursor-pointer transition text-center"
            >
              {triggeringWeekly ? "Triggering..." : "⚡ Run Weekly Review"}
            </button>
          </div>

          <div className="flex-1 overflow-y-auto space-y-2 pr-1">
            {loading && briefings.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12">Loading briefings history...</div>
            ) : briefings.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12">No scheduled briefings compiled yet. Try triggering one above!</div>
            ) : (
              briefings.map(b => {
                const isSelected = selectedBriefing?.id === b.id;
                const isMorning = b.kind === "morning_briefing";
                return (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBriefing(b)}
                    className={`w-full text-left p-3 rounded-lg border transition cursor-pointer flex flex-col gap-2 ${
                      isSelected
                        ? "bg-slate-900/60 border-slate-700 text-slate-100"
                        : "bg-slate-950/40 border-slate-900/60 text-slate-400 hover:bg-slate-900/20 hover:border-slate-850"
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-xxs font-mono text-slate-500">{formatDate(b.created_at)}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isMorning
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                      }`}>
                        {isMorning ? "Morning" : "Weekly"}
                      </span>
                    </div>
                    <span className="text-xs font-semibold line-clamp-2">
                      {b.summary.replace(/[#*`\n-]/g, " ").substring(0, 80).trim()}...
                    </span>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Briefing View */}
        <section className="flex-1 bg-slate-950/60 border border-slate-900 rounded-xl p-6 flex flex-col justify-between h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] overflow-hidden">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-mono text-xs">
              {error}
            </div>
          ) : !selectedBriefing ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              Select a briefing from the list to display content.
            </div>
          ) : (
            <div className="flex-1 flex flex-col h-full overflow-hidden">
              {/* Header */}
              <div className="border-b border-slate-900 pb-4 mb-4 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 text-[9px] font-bold rounded-lg border uppercase ${
                      selectedBriefing.kind === "morning_briefing"
                        ? "bg-amber-500/10 text-amber-400 border-amber-500/20"
                        : "bg-violet-500/10 text-violet-400 border-violet-500/20"
                    }`}>
                      {selectedBriefing.kind === "morning_briefing" ? "Daily Briefing" : "Weekly Review"}
                    </span>
                    <span className="text-xxs font-mono text-slate-500">
                      ID: {selectedBriefing.id.substring(0, 8)}...
                    </span>
                  </div>
                  <h2 className="text-sm font-mono text-slate-400">
                    Compiled on {new Date(selectedBriefing.created_at).toLocaleString()}
                  </h2>
                </div>
              </div>

              {/* Body */}
              <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-900/60 p-6 rounded-xl select-text">
                {renderMarkdown(selectedBriefing.summary)}
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
