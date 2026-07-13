"use client";

import { useEffect, useState } from "react";

interface Memory {
  id: string;
  kind: "semantic" | "episodic" | "procedural";
  content: string;
  importance: number;
  created_at: string;
  last_accessed_at: string;
}

export default function MemoriesPage() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedKind, setSelectedKind] = useState<string>("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formKind, setFormKind] = useState<"semantic" | "episodic" | "procedural">("semantic");
  const [formContent, setFormContent] = useState("");
  const [formImportance, setFormImportance] = useState(5);
  const [formSubmitting, setFormSubmitting] = useState(false);

  const fetchMemories = async (query = "") => {
    setLoading(true);
    try {
      const url = query 
        ? `http://localhost:8000/memories?search=${encodeURIComponent(query)}`
        : "http://localhost:8000/memories";
      const res = await fetch(url);
      if (!res.ok) throw new Error("Failed to load memories from backend");
      const data = await res.json();
      setMemories(data);
      setError(null);
    } catch (err: any) {
      setError(err.message || "Failed to connect to backend");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMemories(searchQuery);
  }, [searchQuery]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want VIZIER to forget this memory?")) return;
    try {
      const res = await fetch(`http://localhost:8000/memories/${id}`, {
        method: "DELETE"
      });
      if (!res.ok) throw new Error("Failed to delete memory");
      setMemories(memories.filter(m => m.id !== id));
    } catch (err: any) {
      alert(err.message || "Error deleting memory");
    }
  };

  const handleEditClick = (memory: Memory) => {
    setEditingId(memory.id);
    setFormKind(memory.kind);
    setFormContent(memory.content);
    setFormImportance(memory.importance);
    setShowAddForm(true);
  };

  const resetForm = () => {
    setEditingId(null);
    setFormKind("semantic");
    setFormContent("");
    setFormImportance(5);
    setShowAddForm(false);
    setFormSubmitting(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formContent.trim()) return;
    setFormSubmitting(true);

    try {
      if (editingId) {
        // Edit Mode
        const res = await fetch(`http://localhost:8000/memories/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: formKind,
            content: formContent,
            importance: formImportance
          })
        });
        if (!res.ok) throw new Error("Failed to update memory");
      } else {
        // Add Mode
        const res = await fetch("http://localhost:8000/memories", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            kind: formKind,
            content: formContent,
            importance: formImportance
          })
        });
        if (!res.ok) throw new Error("Failed to create memory");
      }
      resetForm();
      fetchMemories(searchQuery);
    } catch (err: any) {
      alert(err.message || "Error submitting form");
      setFormSubmitting(false);
    }
  };

  // Filter memories locally by kind tab
  const filteredMemories = selectedKind === "all" 
    ? memories 
    : memories.filter(m => m.kind === selectedKind);

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 p-6 font-sans flex justify-center">
      <div className="max-w-5xl w-full">
        {/* Header */}
        <header className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b border-slate-900 pb-6">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-violet-400 via-indigo-400 to-cyan-400 bg-clip-text text-transparent">
              VIZIER Memory Vault
            </h1>
            <p className="text-slate-400 text-sm mt-1">
              View, edit, or remove the long-term context VIZIER extracts to personalize your interactions.
            </p>
          </div>
          <div>
            <button
              onClick={() => {
                resetForm();
                setShowAddForm(true);
              }}
              className="px-4 py-2 bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-500 hover:to-indigo-500 text-slate-100 font-semibold rounded-lg shadow-lg hover:shadow-indigo-500/20 text-xs transition duration-200 cursor-pointer"
            >
              + Create Memory
            </button>
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main List Column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Tabs */}
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-slate-950/40 p-4 border border-slate-900 rounded-xl backdrop-blur-sm">
              {/* Search */}
              <div className="relative w-full sm:w-72">
                <input
                  type="text"
                  placeholder="Search memory contents..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 bg-slate-900/60 border border-slate-800 focus:border-indigo-500 focus:outline-none text-slate-200 text-xs rounded-lg transition"
                />
                <span className="absolute left-3 top-3 text-slate-500">
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </span>
              </div>

              {/* Tabs */}
              <div className="flex bg-slate-900/40 p-0.5 rounded-lg border border-slate-800 w-full sm:w-auto overflow-x-auto">
                {["all", "semantic", "episodic", "procedural"].map((kind) => (
                  <button
                    key={kind}
                    onClick={() => setSelectedKind(kind)}
                    className={`px-3 py-1.5 rounded-md text-xs font-semibold capitalize transition cursor-pointer whitespace-nowrap ${
                      selectedKind === kind 
                        ? "bg-indigo-600 text-slate-100 shadow" 
                        : "text-slate-400 hover:text-slate-200"
                    }`}
                  >
                    {kind}
                  </button>
                ))}
              </div>
            </div>

            {/* List */}
            {loading && memories.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/10 border border-slate-900/50 rounded-xl">
                <div className="inline-block animate-pulse w-6 h-6 rounded-full bg-indigo-500/20 border-2 border-indigo-500 border-t-transparent mb-2"></div>
                <p className="text-xs text-slate-500">Retrieving Memory Vault from database...</p>
              </div>
            ) : error ? (
              <div className="p-4 bg-rose-950/20 border border-rose-900/30 text-rose-400 text-xs rounded-xl font-mono">
                Error Connecting Backend: {error}
              </div>
            ) : filteredMemories.length === 0 ? (
              <div className="text-center py-12 bg-slate-950/20 border border-slate-900/50 rounded-xl">
                <p className="text-sm text-slate-400">No memories found.</p>
                <p className="text-xs text-slate-600 mt-1">VIZIER will automatically populate this vault when you converse with it.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredMemories.map((m) => (
                  <div 
                    key={m.id}
                    className="p-5 bg-slate-950/30 border border-slate-900 hover:border-slate-800 rounded-xl transition duration-200 group relative flex flex-col justify-between gap-3"
                  >
                    {/* Top Row: Type and Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          m.kind === "semantic"
                            ? "bg-violet-500/10 text-violet-400 border border-violet-500/20"
                            : m.kind === "episodic"
                            ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                            : "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20"
                        }`}>
                          {m.kind}
                        </span>
                        <span className={`px-2 py-0.5 rounded text-[10px] font-semibold border ${
                          m.importance >= 7 
                            ? "bg-amber-500/10 text-amber-400 border-amber-500/20" 
                            : "bg-slate-800/40 text-slate-400 border-slate-700/30"
                        }`}>
                          Imp: {m.importance}/10
                        </span>
                      </div>
                      
                      {/* Action buttons */}
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleEditClick(m)}
                          className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-slate-900 rounded transition cursor-pointer"
                          title="Edit Memory"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => handleDelete(m.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-900 rounded transition cursor-pointer"
                          title="Forget Memory"
                        >
                          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                      </div>
                    </div>

                    {/* Content */}
                    <p className="text-slate-200 text-sm leading-relaxed font-medium">
                      {m.content}
                    </p>

                    {/* Footer dates */}
                    <div className="flex items-center gap-4 text-[10px] text-slate-500 border-t border-slate-900/60 pt-2 font-mono">
                      <span>Created: {new Date(m.created_at).toLocaleDateString()}</span>
                      <span>Last Accessed: {new Date(m.last_accessed_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Form and Explanation Column */}
          <div className="space-y-6">
            {/* Form */}
            {showAddForm && (
              <div className="bg-slate-950/40 border border-slate-900 rounded-xl p-6 backdrop-blur-sm animate-fadeIn">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-sm font-bold text-slate-300">
                    {editingId ? "Edit Memory" : "Create Manual Memory"}
                  </h2>
                  <button onClick={resetForm} className="text-slate-500 hover:text-slate-300 text-xs">
                    Cancel
                  </button>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Memory Kind
                    </label>
                    <select
                      value={formKind}
                      onChange={(e: any) => setFormKind(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                    >
                      <option value="semantic">Semantic (Facts & Preferences)</option>
                      <option value="episodic">Episodic (Events & Interactions)</option>
                      <option value="procedural">Procedural (Styling & Rules)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Content
                    </label>
                    <textarea
                      placeholder="e.g. The principal prefers meeting summaries in short, bulleted lists."
                      value={formContent}
                      onChange={(e) => setFormContent(e.target.value)}
                      rows={3}
                      className="w-full bg-slate-900 border border-slate-800 rounded-lg px-3 py-2 text-xs text-slate-200 focus:outline-none focus:border-indigo-500"
                      required
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      <span>Importance</span>
                      <span className="text-indigo-400">{formImportance}/10</span>
                    </div>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      value={formImportance}
                      onChange={(e) => setFormImportance(parseInt(e.target.value))}
                      className="w-full accent-indigo-500"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={formSubmitting}
                    className="w-full py-2 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 text-slate-100 font-semibold rounded-lg text-xs transition duration-200 cursor-pointer shadow-md"
                  >
                    {formSubmitting 
                      ? "Saving..." 
                      : editingId 
                      ? "Update Memory" 
                      : "Save Memory"}
                  </button>
                </form>
              </div>
            )}

            {/* Explanation Panel */}
            <div className="bg-slate-950/20 border border-slate-900 rounded-xl p-6 space-y-4">
              <h2 className="text-sm font-bold text-slate-300 border-b border-slate-900 pb-2 flex items-center gap-2">
                <svg className="w-4 h-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Memory Transparency
              </h2>
              <p className="text-xs text-slate-400 leading-relaxed">
                In a personal AI Chief-of-Staff, trust and user agency are absolute requirements.
              </p>
              <div className="space-y-3 pt-2">
                <div className="flex gap-3">
                  <div className="text-slate-500 font-mono text-xs">01</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    <strong className="text-slate-300 block">User Control & Privacy:</strong>
                    Users have a fundamental right to inspect, edit, or delete personal profiles constructed by AI systems, supporting safety standards like GDPR's "Right to be Forgotten".
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-slate-500 font-mono text-xs">02</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    <strong className="text-slate-300 block">Correcting Misextractions:</strong>
                    If an agent misinterprets a casual remark as a permanent rule, the user can instantly delete it here, eliminating behavioral anomalies conversationally.
                  </p>
                </div>
                <div className="flex gap-3">
                  <div className="text-slate-500 font-mono text-xs">03</div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    <strong className="text-slate-300 block">Procedural Gating:</strong>
                    Directly editing procedural instructions allows tailoring draft lengths, styles, and task execution rules without altering system-level codebase.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
