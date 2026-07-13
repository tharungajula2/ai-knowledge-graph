"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Proposal {
  id: string;
  agent: string;
  action_type: string;
  payload: any;
  rationale: string;
  risk_tier: string;
  status: string;
  created_at: string;
  decided_at?: string;
  executed_at?: string;
  result?: any;
}

export default function ApprovalsPage() {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [history, setHistory] = useState<Proposal[]>([]);
  const [activeTab, setActiveTab] = useState<"pending" | "history">("pending");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPayload, setEditPayload] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState<string | null>(null);

  const fetchProposals = async () => {
    try {
      // We fetch all proposals from our FastAPI backend to get the parsed payloads.
      // Alternatively, fetch via supabase.from("proposed_actions")
      const res = await fetch("http://localhost:8000/proposals");
      const data = await res.json();
      if (Array.isArray(data)) {
        setProposals(data.filter((p: Proposal) => p.status === "proposed"));
        setHistory(data.filter((p: Proposal) => p.status !== "proposed"));
      }
    } catch (err) {
      console.error("Error fetching proposals:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProposals();

    // Set up Supabase Realtime channel to listen to changes on proposed_actions table
    const channel = supabase
      .channel("proposed_actions_changes")
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "proposed_actions" },
        () => {
          console.log("[Supabase Realtime] Change detected in proposed_actions table.");
          fetchProposals();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const handleApprove = async (id: string, customPayload?: any) => {
    setActionLoadingId(id);
    try {
      if (customPayload) {
        // Edit first, then approve
        await fetch(`http://localhost:8000/proposals/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ payload: customPayload }),
        });
      }

      const res = await fetch(`http://localhost:8000/proposals/${id}/approve`, {
        method: "POST",
      });
      const result = await res.json();
      console.log("Approve result:", result);
      setEditingId(null);
      fetchProposals();
    } catch (err) {
      console.error("Error approving proposal:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id: string) => {
    setActionLoadingId(id);
    try {
      const res = await fetch(`http://localhost:8000/proposals/${id}/reject`, {
        method: "POST",
      });
      const result = await res.json();
      console.log("Reject result:", result);
      fetchProposals();
    } catch (err) {
      console.error("Error rejecting proposal:", err);
    } finally {
      setActionLoadingId(null);
    }
  };

  const startEdit = (proposal: Proposal) => {
    setEditingId(proposal.id);
    setEditPayload({ ...proposal.payload });
  };

  const handleEditChange = (key: string, value: string) => {
    setEditPayload((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const getRiskBadgeColor = (risk: string) => {
    switch (risk) {
      case "high":
        return "bg-rose-950/40 text-rose-400 border-rose-800/60";
      case "medium":
        return "bg-amber-950/40 text-amber-400 border-amber-800/60";
      case "low":
      default:
        return "bg-emerald-950/40 text-emerald-400 border-emerald-800/60";
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      {/* Header */}
      <div className="max-w-6xl mx-auto mb-10">
        <div className="flex justify-between items-center border-b border-slate-800 pb-5">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              🛡️ VIZIER Safety Cockpit
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Gated Human-in-the-Loop Write Action Approvals
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/"
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition text-sm"
            >
              💬 Back to Chat
            </Link>
            <Link
              href="/settings"
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition text-sm"
            >
              ⚙️ Safety Settings
            </Link>
            <Link
              href="/audit"
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition text-sm"
            >
              📜 Audit Logs
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-4 mt-8 border-b border-slate-900 pb-px">
          <button
            onClick={() => setActiveTab("pending")}
            className={`pb-3 font-semibold text-sm transition relative ${
              activeTab === "pending"
                ? "text-white border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Pending Review
            {proposals.length > 0 && (
              <span className="ml-2 bg-rose-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {proposals.length}
              </span>
            )}
          </button>
          <button
            onClick={() => setActiveTab("history")}
            className={`pb-3 font-semibold text-sm transition ${
              activeTab === "history"
                ? "text-white border-b-2 border-emerald-500"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            History
          </button>
        </div>

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
          </div>
        ) : activeTab === "pending" ? (
          proposals.length === 0 ? (
            <div className="text-center py-20 bg-slate-900/30 border border-dashed border-slate-800 rounded-lg mt-8">
              <span className="text-4xl">🟢</span>
              <h3 className="text-lg font-semibold text-white mt-4">All Systems Clear</h3>
              <p className="text-sm text-slate-400 mt-1">No proposed actions require human authorization right now.</p>
            </div>
          ) : (
            <div className="grid gap-6 mt-8">
              {proposals.map((p) => (
                <div
                  key={p.id}
                  className="bg-slate-900/60 border border-slate-800 rounded-lg p-6 flex flex-col md:flex-row gap-6 justify-between items-start shadow-xl relative overflow-hidden"
                >
                  <div className="flex-1 w-full">
                    {/* Top Info */}
                    <div className="flex flex-wrap items-center gap-3 mb-4">
                      <span className="text-xs uppercase bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded border border-slate-700">
                        {p.agent} Specialist
                      </span>
                      <span className="text-xs uppercase bg-slate-800 text-slate-300 font-mono px-2.5 py-1 rounded border border-slate-700">
                        {p.action_type}
                      </span>
                      <span
                        className={`text-xs uppercase font-bold border px-2.5 py-0.5 rounded ${getRiskBadgeColor(
                          p.risk_tier
                        )}`}
                      >
                        {p.risk_tier} Risk
                      </span>
                      <span className="text-xs text-slate-500 ml-auto">
                        Proposed: {new Date(p.created_at).toLocaleString()}
                      </span>
                    </div>

                    {/* Rationale */}
                    <div className="mb-5 bg-slate-950/50 rounded p-3 border border-slate-900 text-sm">
                      <strong className="text-slate-400 block mb-1">Rationale/Goal:</strong>
                      <span className="text-slate-200">{p.rationale}</span>
                    </div>

                    {/* Action Payload Preview / Edit Mode */}
                    <div className="border border-slate-800/80 rounded bg-slate-950/80 overflow-hidden shadow-inner">
                      <div className="bg-slate-900/80 border-b border-slate-850 px-4 py-2 flex justify-between items-center">
                        <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Payload Content</span>
                        {editingId !== p.id && (
                          <button
                            onClick={() => startEdit(p)}
                            className="text-xs text-emerald-400 hover:text-emerald-300 font-semibold"
                          >
                            ✏️ Edit Action
                          </button>
                        )}
                      </div>

                      <div className="p-5">
                        {editingId === p.id ? (
                          <div className="grid gap-4">
                            {/* Render Inputs dynamically based on action_type */}
                            {p.action_type === "send_email" && (
                              <>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">To Address</label>
                                  <input
                                    type="text"
                                    value={editPayload.to || ""}
                                    onChange={(e) => handleEditChange("to", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Subject</label>
                                  <input
                                    type="text"
                                    value={editPayload.subject || ""}
                                    onChange={(e) => handleEditChange("subject", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Email Body</label>
                                  <textarea
                                    value={editPayload.body || ""}
                                    onChange={(e) => handleEditChange("body", e.target.value)}
                                    rows={6}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500 font-sans"
                                  />
                                </div>
                              </>
                            )}

                            {p.action_type === "create_calendar_event" && (
                              <>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Event Title</label>
                                  <input
                                    type="text"
                                    value={editPayload.title || ""}
                                    onChange={(e) => handleEditChange("title", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-xs text-slate-400 font-bold block mb-1">Start DateTime</label>
                                    <input
                                      type="text"
                                      value={editPayload.start_time || ""}
                                      onChange={(e) => handleEditChange("start_time", e.target.value)}
                                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                  <div>
                                    <label className="text-xs text-slate-400 font-bold block mb-1">End DateTime</label>
                                    <input
                                      type="text"
                                      value={editPayload.end_time || ""}
                                      onChange={(e) => handleEditChange("end_time", e.target.value)}
                                      className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                    />
                                  </div>
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Description</label>
                                  <textarea
                                    value={editPayload.description || ""}
                                    onChange={(e) => handleEditChange("description", e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </>
                            )}

                            {p.action_type === "create_task" && (
                              <>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Task Title</label>
                                  <input
                                    type="text"
                                    value={editPayload.title || ""}
                                    onChange={(e) => handleEditChange("title", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Due Date (YYYY-MM-DD)</label>
                                  <input
                                    type="text"
                                    value={editPayload.due_date || ""}
                                    onChange={(e) => handleEditChange("due_date", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Notes</label>
                                  <textarea
                                    value={editPayload.notes || ""}
                                    onChange={(e) => handleEditChange("notes", e.target.value)}
                                    rows={3}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </>
                            )}

                            {p.action_type === "label_email" && (
                              <>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Email ID</label>
                                  <input
                                    type="text"
                                    value={editPayload.email_id || ""}
                                    onChange={(e) => handleEditChange("email_id", e.target.value)}
                                    disabled
                                    className="w-full bg-slate-900/50 border border-slate-800 rounded px-3 py-2 text-sm text-slate-500"
                                  />
                                </div>
                                <div>
                                  <label className="text-xs text-slate-400 font-bold block mb-1">Label Name</label>
                                  <input
                                    type="text"
                                    value={editPayload.label_name || ""}
                                    onChange={(e) => handleEditChange("label_name", e.target.value)}
                                    className="w-full bg-slate-900 border border-slate-800 rounded px-3 py-2 text-sm text-slate-100 focus:outline-none focus:border-emerald-500"
                                  />
                                </div>
                              </>
                            )}

                            <div className="flex gap-3 justify-end mt-2">
                              <button
                                onClick={() => setEditingId(null)}
                                className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-xs font-semibold rounded text-slate-300 transition"
                              >
                                Cancel Edit
                              </button>
                              <button
                                onClick={() => handleApprove(p.id, editPayload)}
                                disabled={actionLoadingId === p.id}
                                className="px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-xs font-semibold rounded text-white transition flex items-center gap-1"
                              >
                                Save & Approve
                              </button>
                            </div>
                          </div>
                        ) : (
                          /* Render Preview Mockups */
                          <>
                            {p.action_type === "send_email" && (
                              <div className="font-sans border border-slate-800 bg-slate-900/25 rounded overflow-hidden">
                                <div className="bg-slate-900/50 border-b border-slate-800 p-3 text-xs text-slate-400 space-y-1">
                                  <div>
                                    <strong className="text-slate-300">To:</strong> {p.payload.to}
                                  </div>
                                  <div>
                                    <strong className="text-slate-300">Subject:</strong> {p.payload.subject}
                                  </div>
                                </div>
                                <div className="p-4 text-sm text-slate-200 whitespace-pre-wrap font-sans leading-relaxed">
                                  {p.payload.body}
                                </div>
                              </div>
                            )}

                            {p.action_type === "create_calendar_event" && (
                              <div className="flex gap-4 items-start p-4 bg-slate-900/20 border border-slate-800/60 rounded">
                                <div className="bg-emerald-950/60 border border-emerald-800 text-emerald-400 p-3 rounded font-extrabold text-center tracking-tight flex flex-col justify-center min-w-[70px]">
                                  <span className="text-xs uppercase font-semibold">Event</span>
                                  <span className="text-lg">🗓️</span>
                                </div>
                                <div className="space-y-1 flex-1">
                                  <h4 className="text-base font-bold text-white leading-snug">{p.payload.title}</h4>
                                  <p className="text-xs text-slate-400">
                                    🕒 {p.payload.start_time} to {p.payload.end_time}
                                  </p>
                                  {p.payload.description && (
                                    <p className="text-xs text-slate-300 bg-slate-900/40 p-2 rounded mt-2 border border-slate-900">
                                      {p.payload.description}
                                    </p>
                                  )}
                                </div>
                              </div>
                            )}

                            {p.action_type === "create_task" && (
                              <div className="flex gap-3 items-center p-3 bg-slate-900/25 border border-slate-800/60 rounded text-sm">
                                <input type="checkbox" disabled className="h-4 w-4 rounded bg-slate-900 border-slate-700 text-emerald-500" />
                                <div className="flex-1">
                                  <span className="font-semibold text-slate-100">{p.payload.title}</span>
                                  {p.payload.due_date && (
                                    <span className="ml-3 text-xs bg-slate-800 text-slate-400 px-2 py-0.5 rounded">
                                      📅 Due: {p.payload.due_date}
                                    </span>
                                  )}
                                  {p.payload.notes && (
                                    <p className="text-xs text-slate-400 mt-1">{p.payload.notes}</p>
                                  )}
                                </div>
                              </div>
                            )}

                            {p.action_type === "label_email" && (
                              <div className="p-3 bg-slate-900/25 border border-slate-800/60 rounded text-sm flex items-center justify-between">
                                <span className="text-slate-300 font-mono text-xs">Email ID: {p.payload.email_id}</span>
                                <span className="bg-emerald-950 text-emerald-400 font-bold border border-emerald-800/60 px-2 py-0.5 rounded text-xs">
                                  🏷️ Apply Label: {p.payload.label_name}
                                </span>
                              </div>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Actions Column */}
                  {editingId !== p.id && (
                    <div className="flex md:flex-col gap-3 w-full md:w-auto border-t md:border-t-0 md:border-l border-slate-800/80 pt-4 md:pt-0 md:pl-6 justify-end h-full self-stretch min-w-[140px]">
                      <button
                        onClick={() => handleApprove(p.id)}
                        disabled={actionLoadingId === p.id}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-sm font-bold text-white rounded transition shadow-lg shadow-emerald-900/20 disabled:opacity-50"
                      >
                        {actionLoadingId === p.id ? "Working..." : "👍 Approve"}
                      </button>
                      <button
                        onClick={() => handleReject(p.id)}
                        disabled={actionLoadingId === p.id}
                        className="flex-1 md:flex-none px-4 py-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-slate-600 text-sm font-bold text-slate-300 rounded transition disabled:opacity-50"
                      >
                        👎 Reject
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        ) : (
          /* History Tab */
          <div className="bg-slate-900/40 border border-slate-850 rounded-lg overflow-hidden mt-8">
            {history.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-slate-400 text-sm">No action history found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-900 border-b border-slate-800 text-slate-400 font-bold uppercase tracking-wider text-xs">
                      <th className="p-4">Action</th>
                      <th className="p-4">Agent</th>
                      <th className="p-4">Risk</th>
                      <th className="p-4">Status</th>
                      <th className="p-4">Date</th>
                      <th className="p-4">Result</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-900">
                    {history.map((h) => (
                      <tr key={h.id} className="hover:bg-slate-900/20 transition">
                        <td className="p-4 font-semibold text-white">{h.action_type}</td>
                        <td className="p-4 text-slate-300">{h.agent}</td>
                        <td className="p-4">
                          <span
                            className={`px-2 py-0.5 rounded text-xs font-semibold ${
                              h.risk_tier === "high"
                                ? "bg-rose-950/30 text-rose-400 border border-rose-900/50"
                                : h.risk_tier === "medium"
                                ? "bg-amber-950/30 text-amber-400 border border-amber-900/50"
                                : "bg-emerald-950/30 text-emerald-400 border border-emerald-900/50"
                            }`}
                          >
                            {h.risk_tier}
                          </span>
                        </td>
                        <td className="p-4 font-mono font-bold">
                          {h.status === "executed" && <span className="text-emerald-500">🚀 Executed</span>}
                          {h.status === "rejected" && <span className="text-slate-500">❌ Rejected</span>}
                          {h.status === "failed" && <span className="text-rose-500">💥 Failed</span>}
                        </td>
                        <td className="p-4 text-slate-400 text-xs">
                          {new Date(h.decided_at || h.created_at).toLocaleString()}
                        </td>
                        <td className="p-4 font-mono text-xs max-w-xs truncate text-slate-500" title={JSON.stringify(h.result)}>
                          {JSON.stringify(h.result)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
