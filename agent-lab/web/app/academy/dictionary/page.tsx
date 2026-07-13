"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface DictionaryTerm {
  id: string;
  term: string;
  category: string;
  beginner_definition: string;
  deep_definition: string;
  analogy: string;
  related_terms: string[];
  first_seen_phase: string;
}

interface UserProgress {
  item_id: string;
  status: string;
}

function DictionaryContent() {
  const searchParams = useSearchParams();
  const initialTermParam = searchParams.get("term");

  const [terms, setTerms] = useState<DictionaryTerm[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({}); // termId -> status
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState("All");
  const [selectedTerm, setSelectedTerm] = useState<DictionaryTerm | null>(null);
  const [activeTab, setActiveTab] = useState<"beginner" | "deep" | "analogy">("beginner");
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  // Load Categories list dynamically from terms
  const categories = ["All", "Basics", "Agentic", "Architectures", "Protocols", "RAG", "Memory", "Durable Execution", "Safety", "Observability"];

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch terms
      const { data: termsData, error: termsError } = await supabase
        .from("dictionary_terms")
        .select("*")
        .order("term", { ascending: true });
      if (termsError) throw termsError;

      setTerms(termsData || []);

      // 2. Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("item_id, status")
        .eq("item_type", "term");
      if (progressError) throw progressError;

      const progressMap: Record<string, string> = {};
      progressData?.forEach(p => {
        progressMap[p.item_id] = p.status;
      });
      setProgress(progressMap);

      // 3. Handle initial selection
      if (termsData && termsData.length > 0) {
        if (initialTermParam) {
          const match = termsData.find(t => t.term.toLowerCase() === initialTermParam.toLowerCase());
          setSelectedTerm(match || termsData[0]);
        } else {
          setSelectedTerm(termsData[0]);
        }
      }
    } catch (err: any) {
      console.error("Error loading dictionary:", err);
      setError(err.message || "Failed to load dictionary data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [initialTermParam]);

  const toggleLearned = async (termId: string) => {
    if (updating) return;
    setUpdating(true);
    const currentStatus = progress[termId];
    const newStatus = currentStatus === "done" ? "not_started" : "done";

    try {
      // Query if progress record already exists
      const { data: existing, error: queryError } = await supabase
        .from("user_progress")
        .select("id")
        .eq("item_type", "term")
        .eq("item_id", termId)
        .maybeSingle();

      if (queryError) throw queryError;

      if (existing) {
        // Update
        const { error: updateError } = await supabase
          .from("user_progress")
          .update({ 
            status: newStatus, 
            updated_at: new Date().toISOString() 
          })
          .eq("id", existing.id);
        if (updateError) throw updateError;
      } else {
        // Insert
        const { error: insertError } = await supabase
          .from("user_progress")
          .insert({
            item_type: "term",
            item_id: termId,
            status: newStatus,
            updated_at: new Date().toISOString()
          });
        if (insertError) throw insertError;
      }

      // Update state local mapping
      setProgress(prev => ({
        ...prev,
        [termId]: newStatus
      }));
    } catch (err: any) {
      console.error("Error updating progress:", err);
      alert("Failed to update learning status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Filter list of terms
  const filteredTerms = terms.filter(t => {
    const matchesSearch = t.term.toLowerCase().includes(search.toLowerCase()) || 
                          t.beginner_definition.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === "All" || t.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex flex-col">
      {/* Navbar */}
      <nav className="border-b border-slate-900 bg-slate-950/40 sticky top-0 z-10 backdrop-blur-sm px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-indigo-400 bg-clip-text text-transparent">
            VIZIER Academy
          </span>
          <span className="px-2 py-0.5 bg-slate-900 text-slate-500 rounded text-xxs font-mono border border-slate-850">
            v0.1.0
          </span>
        </div>
        <div className="flex items-center gap-4 text-sm font-medium">
          <Link href="/academy" className="text-slate-400 hover:text-slate-200">Dashboard</Link>
          <Link href="/academy/dictionary" className="text-indigo-400 hover:text-indigo-300">Dictionary</Link>
          <Link href="/academy/lessons" className="text-slate-400 hover:text-slate-200">Curriculum</Link>
          <Link href="/status" className="text-slate-400 hover:text-slate-200">API Status</Link>
        </div>
      </nav>

      {/* Main Dual-Column Panel */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Column: Terms Navigation list */}
        <section className="w-full md:w-80 flex flex-col bg-slate-900/10 border border-slate-900 rounded-xl overflow-hidden p-4 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)]">
          {/* Search bar */}
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search terms..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-lg text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-indigo-500 transition duration-150"
            />
          </div>

          {/* Categories Horizontal scroller */}
          <div className="flex gap-1.5 overflow-x-auto pb-3 mb-3 border-b border-slate-900/80 no-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => {
                  setActiveCategory(cat);
                  // Auto select first term of this category
                  const firstOfCat = terms.find(t => cat === "All" || t.category === cat);
                  if (firstOfCat) setSelectedTerm(firstOfCat);
                }}
                className={`px-2.5 py-1 text-xxs font-semibold rounded transition shrink-0 cursor-pointer ${
                  activeCategory === cat
                    ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20"
                    : "bg-slate-900 text-slate-400 border border-transparent hover:text-slate-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Terms List Scroll container */}
          <div className="flex-1 overflow-y-auto space-y-1 pr-1">
            {loading ? (
              <div className="text-center text-xs text-slate-500 py-8">Loading terms...</div>
            ) : filteredTerms.length === 0 ? (
              <div className="text-center text-xs text-slate-500 py-8">No terms found.</div>
            ) : (
              filteredTerms.map((t) => {
                const isSelected = selectedTerm?.id === t.id;
                const isLearned = progress[t.id] === "done";
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      setSelectedTerm(t);
                      setActiveTab("beginner");
                    }}
                    className={`w-full text-left px-3 py-2.5 rounded-lg flex items-center justify-between transition border cursor-pointer ${
                      isSelected
                        ? "bg-slate-900/40 border-slate-800 text-slate-100"
                        : "bg-transparent border-transparent hover:bg-slate-900/20 text-slate-400 hover:text-slate-300"
                    }`}
                  >
                    <span className="text-sm font-medium tracking-tight truncate">{t.term}</span>
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] text-slate-500 font-mono scale-95 opacity-80 shrink-0">
                        {t.first_seen_phase}
                      </span>
                      {isLearned && (
                        <span className="h-2 w-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.3)] shrink-0"></span>
                      )}
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </section>

        {/* Right Column: Definition details viewer */}
        <section className="flex-1 bg-slate-900/10 border border-slate-900 rounded-xl p-6 flex flex-col justify-between h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] overflow-y-auto">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400">
              <p className="text-sm font-mono text-rose-400">{error}</p>
            </div>
          ) : !selectedTerm ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
              Select a term from the list to begin learning.
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between gap-6">
              {/* Term Header */}
              <div>
                <div className="flex items-center justify-between gap-4 border-b border-slate-900/80 pb-4 mb-6">
                  <div>
                    <span className="px-2.5 py-0.5 bg-slate-950 text-slate-400 border border-slate-850 text-xxs font-semibold tracking-wider uppercase rounded">
                      {selectedTerm.category}
                    </span>
                    <h2 className="text-2xl font-extrabold text-slate-100 tracking-tight mt-3">{selectedTerm.term}</h2>
                  </div>
                  <div>
                    <button
                      onClick={() => toggleLearned(selectedTerm.id)}
                      disabled={updating}
                      className={`px-4 py-2 text-xs font-bold rounded-lg border transition duration-200 cursor-pointer ${
                        progress[selectedTerm.id] === "done"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                          : "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent"
                      }`}
                    >
                      {progress[selectedTerm.id] === "done" ? "✓ Learned" : "Mark as Learned"}
                    </button>
                  </div>
                </div>

                {/* Tab select bar */}
                <div className="flex border-b border-slate-900/60 mb-6 bg-slate-950/20 p-1 rounded-lg max-w-xs">
                  {(["beginner", "deep", "analogy"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 text-xs font-semibold rounded-md capitalize transition cursor-pointer ${
                        activeTab === tab
                          ? "bg-slate-900 text-slate-200 shadow-sm"
                          : "text-slate-500 hover:text-slate-350"
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>

                {/* Tab Content Display */}
                <div className="min-h-40 bg-slate-950/20 border border-slate-900/40 rounded-xl p-5 md:p-6 mb-6">
                  {activeTab === "beginner" && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Beginner Definition</h4>
                      <p className="text-slate-300 text-sm leading-relaxed">{selectedTerm.beginner_definition}</p>
                    </div>
                  )}
                  {activeTab === "deep" && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Deep Tech Definition</h4>
                      <p className="text-slate-300 text-sm font-mono leading-relaxed bg-slate-950/60 p-4 border border-slate-900/80 rounded-lg">{selectedTerm.deep_definition}</p>
                    </div>
                  )}
                  {activeTab === "analogy" && (
                    <div>
                      <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Real-world Analogy</h4>
                      <p className="text-slate-300 text-sm italic leading-relaxed">"{selectedTerm.analogy}"</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Related terms footer */}
              {selectedTerm.related_terms && selectedTerm.related_terms.length > 0 && (
                <div className="border-t border-slate-900/65 pt-4">
                  <h4 className="text-xxs font-bold uppercase tracking-wider text-slate-500 mb-2">Related Concepts:</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedTerm.related_terms.map((rel) => (
                      <button
                        key={rel}
                        onClick={() => {
                          const match = terms.find(t => t.term.toLowerCase() === rel.toLowerCase());
                          if (match) {
                            setSelectedTerm(match);
                            setActiveTab("beginner");
                          }
                        }}
                        className="px-2 py-1 bg-slate-950 hover:bg-slate-900 border border-slate-850 text-xxs rounded text-slate-400 hover:text-slate-300 transition duration-150 cursor-pointer"
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function DictionaryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#090a0f] text-slate-100 flex items-center justify-center font-mono text-sm">
        Initializing Glossary...
      </div>
    }>
      <DictionaryContent />
    </Suspense>
  );
}
