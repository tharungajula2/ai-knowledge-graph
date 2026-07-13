"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

interface PermissionSetting {
  action_type: string;
  permission_tier: string;
}

export default function SettingsPage() {
  const [permissions, setPermissions] = useState<PermissionSetting[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingType, setSavingType] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPermissions = async () => {
    try {
      const res = await fetch("http://localhost:8000/settings/permissions");
      const data = await res.json();
      if (Array.isArray(data)) {
        setPermissions(data);
      }
    } catch (err) {
      console.error("Error fetching permissions:", err);
      setError("Failed to connect to backend server. Make sure FastAPI is running on port 8000.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPermissions();
  }, []);

  const handleUpdatePermission = async (actionType: string, newTier: string) => {
    setSavingType(actionType);
    try {
      const res = await fetch(`http://localhost:8000/settings/permissions/${actionType}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ permission_tier: newTier }),
      });
      const data = await res.json();
      if (data.status === "ok") {
        setPermissions((prev) =>
          prev.map((p) =>
            p.action_type === actionType ? { ...p, permission_tier: newTier } : p
          )
        );
      }
    } catch (err) {
      console.error("Error updating permission:", err);
    } finally {
      setSavingType(null);
    }
  };

  const getActionLabel = (type: string) => {
    switch (type) {
      case "send_email":
        return "📧 Send Email (Gmail API)";
      case "create_calendar_event":
        return "🗓️ Create Calendar Event (Calendar API)";
      case "create_task":
        return "✅ Create Task (Tasks API)";
      case "label_email":
        return "🏷️ Label Email (Gmail API)";
      default:
        return type;
    }
  };

  const getActionRisk = (type: string) => {
    switch (type) {
      case "send_email":
        return { label: "High Risk", color: "text-rose-400 border-rose-900/60 bg-rose-950/20" };
      case "create_calendar_event":
        return { label: "Medium Risk", color: "text-amber-400 border-amber-900/60 bg-amber-950/20" };
      case "create_task":
      case "label_email":
        return { label: "Low Risk", color: "text-emerald-400 border-emerald-900/60 bg-emerald-950/20" };
      default:
        return { label: "Unknown", color: "text-slate-400 border-slate-800 bg-slate-900" };
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans p-8">
      <div className="max-w-4xl mx-auto mb-10">
        {/* Header */}
        <div className="flex justify-between items-center border-b border-slate-800 pb-5 mb-8">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight text-white flex items-center gap-3">
              🛡️ Safety Settings
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Configure write action policies and permission gates for specialist agents
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
          <div className="space-y-8">
            <div className="bg-slate-900/40 border border-slate-800 rounded-lg overflow-hidden">
              <div className="p-6 border-b border-slate-800 bg-slate-900/20">
                <h3 className="text-lg font-bold text-white">Write Permission Policies</h3>
                <p className="text-xs text-slate-400 mt-1">
                  Enforced at the proposal pipeline level. Changes will log to the append-only audit trail.
                </p>
              </div>

              <div className="divide-y divide-slate-850">
                {permissions.map((p) => {
                  const risk = getActionRisk(p.action_type);
                  return (
                    <div key={p.action_type} className="p-6 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <h4 className="text-base font-semibold text-white">{getActionLabel(p.action_type)}</h4>
                          <span className={`text-[10px] uppercase font-bold border px-2 py-0.5 rounded ${risk.color}`}>
                            {risk.label}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Configure how VIZIER executes this action. High-risk actions should always remain gated.
                        </p>
                      </div>

                      {/* Dropdown Options */}
                      <div className="flex items-center gap-3">
                        {savingType === p.action_type && (
                          <span className="text-xs text-slate-500 animate-pulse">Saving...</span>
                        )}
                        <select
                          value={p.permission_tier}
                          onChange={(e) => handleUpdatePermission(p.action_type, e.target.value)}
                          disabled={savingType === p.action_type}
                          className="bg-slate-950 border border-slate-800 rounded px-4 py-2 text-sm text-slate-200 focus:outline-none focus:border-emerald-500"
                        >
                          <option value="always_ask">⏳ Always Ask (Human-in-the-Loop)</option>
                          <option value="auto_approve_low_risk" disabled={p.action_type === "send_email"}>
                            ⚡ Auto-Approve if Risk is Low
                          </option>
                          <option value="blocked">🚫 Blocked (Structurally Disallowed)</option>
                        </select>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Safety Guidance Card */}
            <div className="bg-slate-900/20 border border-slate-850 rounded-lg p-6 space-y-4">
              <h4 className="text-base font-bold text-white flex items-center gap-2">
                🔒 Security Best Practices
              </h4>
              <ul className="text-xs text-slate-400 space-y-2 list-disc list-inside">
                <li>
                  <strong className="text-slate-300">Gmail Send (High Risk):</strong> Should ALWAYS be set to <i>Always Ask</i>. Letting an LLM send emails automatically is an extreme risk due to prompt injection vulnerabilities.
                </li>
                <li>
                  <strong className="text-slate-300">Auto-Approve:</strong> Only available for Low Risk actions (tasks and email labeling). Even if selected, any proposal carrying data from untrusted sources will be auto-escalated by VIZIER.
                </li>
                <li>
                  <strong className="text-slate-300">Blocked:</strong> Prevents the agent from even placing proposals. Choose this if you want to completely disable an integration.
                </li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
