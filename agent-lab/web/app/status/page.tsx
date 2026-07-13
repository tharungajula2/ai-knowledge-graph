"use client";

import { useEffect, useState } from "react";

interface ConfigCheck {
  GEMINI_API_KEY_PRESENT: boolean;
  GROQ_API_KEY_PRESENT: boolean;
  OPENROUTER_API_KEY_PRESENT: boolean;
  SUPABASE_URL_PRESENT: boolean;
  SUPABASE_ANON_KEY_PRESENT: boolean;
  SUPABASE_SERVICE_ROLE_KEY_PRESENT: boolean;
  SUPABASE_DB_URL_PRESENT: boolean;
  LANGFUSE_PUBLIC_KEY_PRESENT: boolean;
  LANGFUSE_SECRET_KEY_PRESENT: boolean;
  TELEGRAM_BOT_TOKEN_PRESENT: boolean;
  TELEGRAM_CHAT_ID_PRESENT: boolean;
  GEMINI_MODEL_CONFIGURED: string;
}

export default function StatusPage() {
  const [backendAlive, setBackendAlive] = useState<boolean | null>(null);
  const [config, setConfig] = useState<ConfigCheck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const checkConnection = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch Health Check
      const healthRes = await fetch("http://localhost:8000/health");
      if (!healthRes.ok) throw new Error("Backend health check failed");
      const healthData = await healthRes.json();
      
      if (healthData.status === "ok") {
        setBackendAlive(true);
        
        // 2. Fetch Config Diagnostics
        const configRes = await fetch("http://localhost:8000/config-check");
        if (configRes.ok) {
          const configData = await configRes.json();
          setConfig(configData);
        }
      } else {
        setBackendAlive(false);
      }
    } catch (err: any) {
      setBackendAlive(false);
      setConfig(null);
      setError(err.message || "Failed to connect to backend server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 flex flex-col items-center justify-center p-6 font-sans">
      <div className="max-w-3xl w-full">
        {/* Header */}
        <header className="mb-8 text-center sm:text-left flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              VIZIER System Status
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              Real-time monitoring and diagnostic dashboard for your AI Chief-of-Staff.
            </p>
          </div>
          <div>
            <button
              onClick={checkConnection}
              disabled={loading}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-md border border-slate-700 transition duration-200 cursor-pointer disabled:opacity-50"
            >
              {loading ? "Checking..." : "Refresh Status"}
            </button>
          </div>
        </header>

        {/* Connection Banner */}
        <section className="bg-slate-900/40 border border-slate-800/80 rounded-xl p-6 mb-8 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Pulsing Status Dot */}
              <div className="relative flex h-4 w-4">
                {backendAlive === true && (
                  <>
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-emerald-500"></span>
                  </>
                )}
                {backendAlive === false && (
                  <>
                    <span className="relative inline-flex rounded-full h-4 w-4 bg-rose-500"></span>
                  </>
                )}
                {backendAlive === null && (
                  <span className="relative inline-flex rounded-full h-4 w-4 bg-amber-500"></span>
                )}
              </div>
              <div>
                <h2 className="text-lg font-bold">Backend Connection</h2>
                <p className="text-xs text-slate-400">
                  {backendAlive === true 
                    ? "FastAPI server running at http://localhost:8000" 
                    : backendAlive === false 
                    ? "Unable to reach FastAPI server. Check uvicorn is running." 
                    : "Connecting to backend..."}
                </p>
              </div>
            </div>
            <div>
              {backendAlive === true ? (
                <span className="px-3 py-1 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-bold rounded-full">
                  ONLINE
                </span>
              ) : backendAlive === false ? (
                <span className="px-3 py-1 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-bold rounded-full">
                  OFFLINE
                </span>
              ) : (
                <span className="px-3 py-1 bg-amber-500/10 text-amber-400 border border-amber-500/20 text-xs font-bold rounded-full">
                  PENDING
                </span>
              )}
            </div>
          </div>
          {error && (
            <div className="mt-4 p-3 bg-rose-950/20 border border-rose-900/30 rounded text-rose-400 text-xs font-mono">
              Error Details: {error}
            </div>
          )}
        </section>

        {/* Configuration Check */}
        {backendAlive === true && config && (
          <section className="bg-slate-900/20 border border-slate-800 rounded-xl p-6 backdrop-blur-sm">
            <h2 className="text-lg font-bold mb-4 text-slate-300">Environment Diagnostics</h2>
            
            {/* Warning Note */}
            <div className="p-3 bg-violet-950/10 border border-violet-900/20 rounded text-slate-400 text-xs mb-6">
              <span className="text-violet-400 font-semibold">Security Shield:</span> Secrets are kept strictly in memory on the backend. This dashboard only queries presence flags (boolean values) to protect your private credentials from browser exposure.
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Column 1: Core and LLM */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase border-b border-slate-800/80 pb-2">
                  AI Model Providers
                </h3>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Gemini API Key</span>
                  <StatusBadge present={config.GEMINI_API_KEY_PRESENT} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Primary Model</span>
                  <span className="text-slate-300 font-mono text-xs bg-slate-800 px-2 py-0.5 rounded">
                    {config.GEMINI_MODEL_CONFIGURED}
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Groq API Key (Fallback)</span>
                  <StatusBadge present={config.GROQ_API_KEY_PRESENT} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">OpenRouter API Key (Fallback)</span>
                  <StatusBadge present={config.OPENROUTER_API_KEY_PRESENT} />
                </div>

                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase border-b border-slate-800/80 pb-2 pt-2">
                  Observability
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Langfuse Public Key</span>
                  <StatusBadge present={config.LANGFUSE_PUBLIC_KEY_PRESENT} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Langfuse Secret Key</span>
                  <StatusBadge present={config.LANGFUSE_SECRET_KEY_PRESENT} />
                </div>
              </div>

              {/* Column 2: DB and Integrations */}
              <div className="space-y-4">
                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase border-b border-slate-800/80 pb-2">
                  Supabase Backend
                </h3>
                
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Supabase API URL</span>
                  <StatusBadge present={config.SUPABASE_URL_PRESENT} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Supabase Anon Key</span>
                  <StatusBadge present={config.SUPABASE_ANON_KEY_PRESENT} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Supabase Service Role Key</span>
                  <StatusBadge present={config.SUPABASE_SERVICE_ROLE_KEY_PRESENT} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Supabase DB URL (Pooler)</span>
                  <StatusBadge present={config.SUPABASE_DB_URL_PRESENT} />
                </div>

                <h3 className="text-xs font-bold tracking-wider text-slate-500 uppercase border-b border-slate-800/80 pb-2 pt-2">
                  Telegram Channel
                </h3>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Telegram Bot Token</span>
                  <StatusBadge present={config.TELEGRAM_BOT_TOKEN_PRESENT} />
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-slate-400">Telegram Chat ID</span>
                  <StatusBadge present={config.TELEGRAM_CHAT_ID_PRESENT} />
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function StatusBadge({ present }: { present: boolean }) {
  return present ? (
    <span className="px-2 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold rounded">
      Configured
    </span>
  ) : (
    <span className="px-2 py-0.5 bg-rose-500/10 text-rose-400 border border-rose-500/20 text-xs font-semibold rounded">
      Missing
    </span>
  );
}
