"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";

interface Proposal {
  id: string;
  created_at: string;
  agent: string;
  action_type: string;
  payload: any;
  rationale: string;
  risk_tier: "low" | "medium" | "high";
  status: "proposed" | "approved" | "rejected" | "executed" | "failed";
}

interface Briefing {
  id: string;
  created_at: string;
  kind: string;
  summary: string;
}

interface Message {
  id: string;
  sender: "user" | "assistant" | "system";
  text: string;
}

export default function DashboardHome() {
  // Chat States
  const [messages, setMessages] = useState<Message[]>([
    { id: "1", sender: "assistant", text: "Hello! I am VIZIER, your proactive AI Chief-of-Staff. How can I assist you today?" }
  ]);
  const [inputText, setInputText] = useState("");
  const [threadId] = useState(`thread_${Math.random().toString(36).substring(7)}`);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [interruptPrompt, setInterruptPrompt] = useState<string | null>(null);
  const [chatLoading, setChatLoading] = useState(false);
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Approvals & Briefings States
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [briefings, setBriefings] = useState<Briefing[]>([]);
  const [selectedBriefing, setSelectedBriefing] = useState<Briefing | null>(null);

  // Evals & System Health States
  const [evalScore, setEvalScore] = useState<number | null>(null);
  const [evalAccuracy, setEvalAccuracy] = useState<number | null>(null);
  const [runningEvals, setRunningEvals] = useState(false);

  // 1. Fetch data initially
  const fetchData = async () => {
    try {
      // Fetch briefings
      const briefRes = await fetch("http://localhost:8000/briefings?limit=3");
      if (briefRes.ok) {
        const data = await briefRes.json();
        setBriefings(data);
      }

      // Fetch evals history to get latest metrics
      const evalRes = await fetch("http://localhost:8000/evals/history?limit=10");
      if (evalRes.ok) {
        const data = await evalRes.json();
        if (data.length > 0) {
          // Group by run_id of latest item
          const latestRunId = data[0].run_id;
          const latestRecords = data.filter((r: any) => r.run_id === latestRunId);
          const matchCount = latestRecords.filter((r: any) => r.routing_match).length;
          const sumScore = latestRecords.reduce((sum: number, r: any) => sum + r.judge_score, 0);
          setEvalScore(Math.round((sumScore / latestRecords.length) * 100));
          setEvalAccuracy(Math.round((matchCount / latestRecords.length) * 100));
        }
      }

      // Fetch initial pending proposals
      const { data: props, error } = await supabase
        .from("proposed_actions")
        .select("*")
        .eq("status", "proposed")
        .order("created_at", { ascending: false });
      if (!error && props) {
        setProposals(props);
      }
    } catch (e) {
      console.error("Failed to load initial dashboard data:", e);
    }
  };

  useEffect(() => {
    fetchData();

    // 2. Real-time subscription to proposals table
    const channel = supabase
      .channel("realtime-dashboard-proposals")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposed_actions" },
        (payload) => {
          console.log("[Supabase Realtime] Proposal update:", payload);
          // Reload proposals lists
          supabase
            .from("proposed_actions")
            .select("*")
            .eq("status", "proposed")
            .order("created_at", { ascending: false })
            .then(({ data }) => {
              if (data) setProposals(data);
            });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  // Scroll to bottom of chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, statusMessage, interruptPrompt]);

  // 3. SSE Chat Submission
  const handleSendMessage = async (e: React.FormEvent, resumeVal: string | null = null) => {
    if (e) e.preventDefault();
    
    let text = inputText.trim();
    if (!text && resumeVal === null) return;

    if (resumeVal === null) {
      // User message
      setMessages(prev => [...prev, { id: String(Date.now()), sender: "user", text }]);
      setInputText("");
    } else {
      // Resume action message
      setMessages(prev => [...prev, { id: String(Date.now()), sender: "system", text: `Approved action details: "${resumeVal}"` }]);
      setInterruptPrompt(null);
    }

    setChatLoading(true);
    setStatusMessage("Connecting to VIZIER core...");

    try {
      const response = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: text,
          thread_id: threadId,
          resume: resumeVal
        })
      });

      if (!response.body) return;
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let done = false;
      let currentReply = "";

      // Add temporary placeholder for assistant
      setMessages(prev => [...prev, { id: "assistant-temp", sender: "assistant", text: "" }]);

      while (!done) {
        const { value, done: readerDone } = await reader.read();
        done = readerDone;
        if (value) {
          const chunk = decoder.decode(value, { stream: !done });
          const lines = chunk.split("\n");
          let currentEvent = "";

          for (const line of lines) {
            if (line.startsWith("event: ")) {
              currentEvent = line.replace("event: ", "").trim();
            } else if (line.startsWith("data: ")) {
              const dataStr = line.replace("data: ", "").trim();
              try {
                const parsed = JSON.parse(dataStr);
                if (currentEvent === "status") {
                  setStatusMessage(parsed.message);
                } else if (currentEvent === "interrupt") {
                  setInterruptPrompt(parsed.message);
                  setStatusMessage("⚠️ Approval Required");
                } else if (currentEvent === "message") {
                  currentReply += parsed.text;
                  setMessages(prev => {
                    const next = [...prev];
                    const idx = next.findIndex(m => m.id === "assistant-temp");
                    if (idx !== -1) {
                      next[idx] = { id: "assistant-temp", sender: "assistant", text: currentReply };
                    }
                    return next;
                  });
                }
              } catch (e) {
                // Ignore partial JSON parsing errors
              }
            }
          }
        }
      }
      
      // Clean up temp ID
      setMessages(prev => prev.map(m => m.id === "assistant-temp" ? { ...m, id: String(Date.now()) } : m));
      setStatusMessage(null);
    } catch (err: any) {
      console.error("Chat error:", err);
      setMessages(prev => [...prev, { id: String(Date.now()), sender: "system", text: "Error: Failed to fetch reply from VIZIER backend." }]);
      setStatusMessage(null);
    } finally {
      setChatLoading(false);
    }
  };

  // 4. Trigger Evals
  const handleRunEvals = async () => {
    if (runningEvals) return;
    setRunningEvals(true);
    try {
      const res = await fetch("http://localhost:8000/evals/run", { method: "POST" });
      if (res.ok) {
        alert("Evals ran successfully!");
        await fetchData();
      }
    } catch (e) {
      alert("Failed to run evaluations.");
    } finally {
      setRunningEvals(false);
    }
  };

  // 5. Handle proposal actions (Approve/Reject)
  const handleProposalDecision = async (id: string, approve: boolean, newPayload: any = null) => {
    try {
      const res = await fetch(`http://localhost:8000/proposals/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          status: approve ? "approved" : "rejected",
          payload: newPayload
        })
      });
      if (!res.ok) {
        throw new Error(`Failed to update proposal: HTTP ${res.status}`);
      }
      // Reload lists
      fetchData();
    } catch (e: any) {
      alert("Error: " + e.message);
    }
  };

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/45 sticky top-0 z-20 backdrop-blur-md px-6 py-4 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-indigo-500 flex items-center justify-center font-bold text-slate-100 shadow-lg shadow-indigo-500/20">
            V
          </div>
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent tracking-tight">
            VIZIER Command Center
          </span>
          <span className="px-2 py-0.5 bg-slate-900/60 text-slate-500 rounded text-xxs font-mono border border-slate-850">
            ACTIVE
          </span>
        </div>
        <div className="flex items-center gap-5 text-sm font-semibold">
          <Link href="/" className="text-indigo-400 hover:text-indigo-300">Console</Link>
          <Link href="/approvals" className="text-slate-400 hover:text-slate-200">Approvals</Link>
          <Link href="/briefings" className="text-slate-400 hover:text-slate-200">Briefings</Link>
          <Link href="/evals" className="text-slate-400 hover:text-slate-200">Evals</Link>
          <Link href="/audit" className="text-slate-400 hover:text-slate-200">Audit Logs</Link>
          <Link href="/settings" className="text-slate-400 hover:text-slate-200">Settings</Link>
        </div>
      </nav>

      {/* Main Unified Workspace */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-4 gap-6 overflow-hidden h-[calc(100vh-80px)]">
        
        {/* PANEL 1: SYSTEM HEALTH & BRIEFINGS (LEFT, 1 Column) */}
        <section className="lg:col-span-1 flex flex-col gap-6 h-full overflow-y-auto">
          {/* Evals & Health */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex flex-col gap-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 border-b border-slate-900 pb-2 flex items-center justify-between">
              <span>System Health & Evals</span>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            </h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Avg Eval Score</span>
                <span className="text-lg font-mono font-bold text-slate-250">{evalScore !== null ? `${evalScore}%` : "N/A"}</span>
              </div>
              <div className="bg-slate-950/60 border border-slate-900 p-3 rounded-xl flex flex-col gap-0.5">
                <span className="text-[10px] text-slate-500 font-bold uppercase">Routing Acc.</span>
                <span className="text-lg font-mono font-bold text-indigo-400">{evalAccuracy !== null ? `${evalAccuracy}%` : "N/A"}</span>
              </div>
            </div>
            <button
              onClick={handleRunEvals}
              disabled={runningEvals}
              className="w-full py-2 bg-slate-900/60 hover:bg-slate-900 text-indigo-400 hover:text-indigo-300 disabled:bg-slate-950 border border-slate-850 hover:border-slate-800 text-xxs font-bold rounded-lg cursor-pointer transition text-center"
            >
              {runningEvals ? "Executing Golden Evals..." : "⚡ Run Golden Evals"}
            </button>
          </div>

          {/* Briefings List */}
          <div className="bg-slate-950/40 border border-slate-900/80 rounded-2xl p-5 backdrop-blur-sm shadow-xl flex-grow flex flex-col justify-between overflow-hidden">
            <div className="flex flex-col h-full overflow-hidden">
              <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 border-b border-slate-900 pb-2 mb-4">
                Recent Briefings
              </h3>
              <div className="flex-1 overflow-y-auto space-y-3 pr-1">
                {briefings.map(b => (
                  <button
                    key={b.id}
                    onClick={() => setSelectedBriefing(b)}
                    className="w-full text-left p-3 bg-slate-950/50 hover:bg-slate-900/40 border border-slate-900 hover:border-slate-800 rounded-xl transition cursor-pointer flex flex-col gap-1.5"
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono text-slate-500">{new Date(b.created_at).toLocaleDateString()}</span>
                      <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold rounded uppercase">
                        {b.kind === "morning_briefing" ? "Morning" : "Weekly"}
                      </span>
                    </div>
                    <span className="text-xs font-semibold text-slate-300 line-clamp-2">
                      {b.summary.replace(/[#*`\n-]/g, " ").substring(0, 80).trim()}...
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PANEL 2: THE CHAT CONSOLE (CENTER, 2 Columns) */}
        <section className="lg:col-span-2 flex flex-col bg-slate-950/20 border border-slate-900 rounded-2xl h-full shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="px-5 py-4 border-b border-slate-900 bg-slate-950/45 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500 shadow-lg shadow-indigo-500/40 animate-pulse"></span>
              <h3 className="text-sm font-bold text-slate-200">VIZIER AI Session</h3>
            </div>
            <span className="text-[10px] font-mono text-slate-500">ID: {threadId}</span>
          </div>

          {/* Messages Window */}
          <div className="flex-1 p-5 overflow-y-auto space-y-4 select-text">
            {messages.map((m) => {
              const isUser = m.sender === "user";
              const isSystem = m.sender === "system";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    isUser
                      ? "bg-indigo-600 text-white font-medium shadow-md shadow-indigo-600/10 rounded-tr-none"
                      : isSystem
                      ? "bg-slate-900/60 border border-slate-850 text-slate-400 font-mono text-xxs"
                      : "bg-slate-900 border border-slate-850/80 text-slate-200 rounded-tl-none"
                  }`}>
                    {renderMarkdown(m.text)}
                  </div>
                </div>
              );
            })}
            
            {/* Status updates */}
            {statusMessage && (
              <div className="flex justify-start">
                <div className="bg-slate-950/80 border border-slate-900/80 rounded-xl px-4 py-2 text-xxs text-indigo-400 font-semibold font-mono flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400 animate-ping"></span>
                  <span>{statusMessage}</span>
                </div>
              </div>
            )}

            {/* Interrupt Gating */}
            {interruptPrompt && (
              <div className="bg-amber-500/5 border border-amber-500/20 p-4 rounded-xl space-y-3 mt-4">
                <div className="flex items-start gap-2">
                  <span className="text-amber-400 text-sm">⚠️</span>
                  <div>
                    <h5 className="text-xs font-bold text-amber-400">Action Intercept Gated</h5>
                    <p className="text-xs text-slate-350 mt-1">{interruptPrompt}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleSendMessage(null as any, "Approved")}
                    className="px-4 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 text-amber-400 text-xxs font-bold rounded-lg cursor-pointer transition"
                  >
                    ✓ Confirm Approval
                  </button>
                  <button
                    onClick={() => handleSendMessage(null as any, "Rejected")}
                    className="px-4 py-1.5 bg-slate-900 hover:bg-slate-850 border border-slate-800 text-slate-500 text-xxs font-bold rounded-lg cursor-pointer transition"
                  >
                    ✗ Cancel Action
                  </button>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Form Input */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 border-t border-slate-900 bg-slate-950/45 flex gap-3 shrink-0"
          >
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Ask VIZIER to schedule, draft, research, analyze stocks..."
              disabled={chatLoading || !!interruptPrompt}
              className="flex-1 bg-slate-900 border border-slate-850/80 rounded-xl px-4 py-3 text-xs text-slate-200 focus:outline-none focus:border-indigo-600 disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={chatLoading || !!interruptPrompt}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:bg-slate-900 text-white text-xs font-bold rounded-xl cursor-pointer transition"
            >
              Send
            </button>
          </form>
        </section>

        {/* PANEL 3: SAFETY COCKPIT Inbox (RIGHT, 1 Column) */}
        <section className="lg:col-span-1 flex flex-col bg-slate-950/40 border border-slate-900/80 rounded-2xl p-5 backdrop-blur-sm h-full shadow-2xl overflow-hidden">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-450 border-b border-slate-900 pb-2 mb-4 flex items-center justify-between shrink-0">
            <span>Safety Approvals Inbox</span>
            {proposals.length > 0 && (
              <span className="px-2 py-0.5 bg-indigo-500/10 text-indigo-400 text-[10px] font-bold rounded-full">
                {proposals.length} pending
              </span>
            )}
          </h3>

          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {proposals.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-12">No pending actions to approve.</div>
            ) : (
              proposals.map(p => {
                const isHigh = p.risk_tier === "high";
                const isMedium = p.risk_tier === "medium";
                return (
                  <div
                    key={p.id}
                    className="p-4 bg-slate-950/50 border border-slate-900 rounded-xl space-y-3 shadow-md"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-slate-500">{p.agent}</span>
                      <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                        isHigh
                          ? "bg-rose-500/10 text-rose-450 border border-rose-500/20"
                          : isMedium
                          ? "bg-amber-500/10 text-amber-400 border border-amber-500/20"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {p.risk_tier}
                      </span>
                    </div>

                    <div className="text-xs space-y-1">
                      <div className="font-bold text-slate-350">Action: {p.action_type}</div>
                      <div className="text-slate-450 italic">"{p.rationale}"</div>
                    </div>

                    {/* Previews */}
                    <div className="bg-slate-950/80 p-2.5 rounded-lg border border-slate-900 font-mono text-[10px] text-slate-400 max-h-24 overflow-y-auto whitespace-pre-wrap select-text">
                      {JSON.stringify(p.payload, null, 2)}
                    </div>

                    {/* Action buttons */}
                    <div className="flex gap-2 shrink-0">
                      <button
                        onClick={() => handleProposalDecision(p.id, true)}
                        className="flex-1 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xxs font-bold rounded-lg cursor-pointer transition text-center"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleProposalDecision(p.id, false)}
                        className="flex-1 py-1.5 bg-slate-900 hover:bg-slate-850 text-slate-500 border border-slate-800 text-xxs font-bold rounded-lg cursor-pointer transition text-center"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </section>

      </div>

      {/* Briefing Modal overlay */}
      {selectedBriefing && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="w-full max-w-4xl max-h-[85vh] bg-[#0c0d14] border border-slate-900 rounded-2xl p-6 flex flex-col justify-between overflow-hidden shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4">
              <div>
                <span className="px-2 py-0.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-[9px] font-bold rounded uppercase">
                  {selectedBriefing.kind === "morning_briefing" ? "Daily Briefing" : "Weekly Review"}
                </span>
                <h4 className="text-sm font-mono text-slate-400 mt-1">{new Date(selectedBriefing.created_at).toLocaleString()}</h4>
              </div>
              <button
                onClick={() => setSelectedBriefing(null)}
                className="text-xs text-slate-500 hover:text-slate-350 cursor-pointer font-bold"
              >
                ✕ Close
              </button>
            </div>
            <div className="flex-1 overflow-y-auto bg-slate-950/40 border border-slate-900 p-5 rounded-xl select-text">
              {renderMarkdown(selectedBriefing.summary)}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
