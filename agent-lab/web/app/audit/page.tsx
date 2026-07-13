"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface AuditLog {
  id: string;
  ts: string;
  actor: string;
  event_type: string;
  details: any;
}

export default function AuditPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://localhost:8000/audit-logs?limit=100");
      const data = await res.json();
      if (Array.isArray(data)) {
        setLogs(data);
      }
    } catch (err) {
      console.error("Error fetching logs:", err);
      setError("Failed to connect to backend server. Make sure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const getActorBadgeColor = (actor: string) => {
    switch (actor.toLowerCase()) {
      case "human":
        return "bg-sky-950/40 text-sky-400 border-sky-900/60";
      case "agent":
        return "bg-violet-950/40 text-violet-400 border-violet-900/60";
      case "system":
      default:
        return "bg-slate-900 text-slate-400 border-slate-800";
    }
  };

  const getEventTypeLabel = (event: string) => {
    switch (event) {
      case "proposal_created":
        return "⏳ Proposal Created";
      case "proposal_approved":
        return "👍 Human Approved";
      case "proposal_rejected":
        return "👎 Human Rejected";
      case "proposal_executed":
        return "🚀 Action Executed";
      case "proposal_failed":
        return "💥 Action Failed";
      case "permission_changed":
        return "⚙️ Policy Changed";
      case "action_blocked":
        return "🚫 Action Blocked";
      default:
        return event;
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <div className="max-w-6xl mx-auto mb-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              📜 Security Audit Trail
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Immutable append-only record of safety configurations, proposals, and action execution
            </p>
          </div>
          <div className="flex gap-4">
            <Link
              href="/approvals"
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition text-sm"
            >
              📥 Approvals Dashboard
            </Link>
            <Link
              href="/"
              className="px-4 py-2 bg-slate-900 border border-slate-800 rounded hover:bg-slate-800 transition text-sm"
            >
              💬 Back to Chat
            </Link>
          </div>
        </div>

        {error && (
          <div className="bg-rose-950/40 border border-rose-900 text-rose-300 p-4 rounded mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/20">
                <h3 className="text-lg font-bold text-white">Immutable Event Log</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Showing the last 100 system security events, ordered chronologically (latest first).
                </p>
              </div>

              {logs.length === 0 ? (
                <div className="text-center py-20">
                  <p className="text-slate-400 text-sm">No audit entries recorded yet.</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-900 border-b border-slate-850 text-slate-400 font-bold uppercase tracking-wider text-xs">
                        <th className="p-4 w-12"></th>
                        <th className="p-4 w-48">Timestamp</th>
                        <th className="p-4 w-28">Actor</th>
                        <th className="p-4 w-52">Event Type</th>
                        <th className="p-4">Short Details</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-900">
                      {logs.map((log) => {
                        const isExpanded = expandedId === log.id;
                        return (
                          <>
                            <tr
                              key={log.id}
                              onClick={() => toggleExpand(log.id)}
                              className="hover:bg-slate-900/40 transition cursor-pointer"
                            >
                              <td className="p-4 text-center text-slate-500">
                                {isExpanded ? "▼" : "▶"}
                              </td>
                              <td className="p-4 text-slate-400 font-mono text-xs">
                                {new Date(log.ts).toLocaleString()}
                              </td>
                              <td className="p-4">
                                <span
                                  className={`px-2 py-0.5 rounded text-xs font-semibold border ${getActorBadgeColor(
                                    log.actor
                                  )}`}
                                >
                                  {log.actor.toUpperCase()}
                                </span>
                              </td>
                              <td className="p-4 font-semibold text-slate-200">
                                {getEventTypeLabel(log.event_type)}
                              </td>
                              <td className="p-4 text-slate-400 truncate max-w-md">
                                {log.event_type === "permission_changed" && (
                                  <span>
                                    Changed <b>{log.details.action_type}</b> to <i>{log.details.new_tier}</i>
                                  </span>
                                )}
                                {log.event_type === "proposal_created" && (
                                  <span>
                                    Created proposal for <b>{log.details.action_type}</b> via <i>{log.details.agent}</i>
                                  </span>
                                )}
                                {log.event_type === "proposal_approved" && (
                                  <span>Approved proposal id <b>{log.details.proposal_id?.slice(0, 8)}...</b></span>
                                )}
                                {log.event_type === "proposal_rejected" && (
                                  <span>Rejected proposal id <b>{log.details.proposal_id?.slice(0, 8)}...</b></span>
                                )}
                                {log.event_type === "proposal_executed" && (
                                  <span>Successfully ran proposal id <b>{log.details.proposal_id?.slice(0, 8)}...</b></span>
                                )}
                                {log.event_type === "proposal_failed" && (
                                  <span className="text-rose-400 font-semibold">
                                    Error: {log.details.error}
                                  </span>
                                )}
                                {log.event_type === "action_blocked" && (
                                  <span className="text-rose-400 font-semibold">
                                    Blocked attempt to {log.details.action_type}
                                  </span>
                                )}
                              </td>
                            </tr>
                            {isExpanded && (
                              <tr className="bg-slate-950/60">
                                <td colSpan={5} className="p-6 border-t border-slate-900">
                                  <div className="space-y-4">
                                    <div className="flex justify-between items-center text-xs text-slate-500 border-b border-slate-900 pb-2">
                                      <span>Event ID: {log.id}</span>
                                      <span>Timestamp: {log.ts}</span>
                                    </div>
                                    <div className="bg-slate-950 p-4 border border-slate-900 rounded font-mono text-xs text-emerald-400 overflow-x-auto whitespace-pre">
                                      {JSON.stringify(log.details, null, 2)}
                                    </div>
                                  </div>
                                </td>
                              </tr>
                            )}
                          </>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
