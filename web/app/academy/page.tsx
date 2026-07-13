"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface Stats {
  totalTerms: number;
  learnedTerms: number;
  totalLessons: number;
  completedLessons: number;
}

interface RecentTerm {
  id: string;
  term: string;
  category: string;
  beginner_definition: string;
}

export default function AcademyDashboard() {
  const [stats, setStats] = useState<Stats>({
    totalTerms: 0,
    learnedTerms: 0,
    totalLessons: 0,
    completedLessons: 0,
  });
  const [loading, setLoading] = useState(true);
  const [recentTerms, setRecentTerms] = useState<RecentTerm[]>([]);
  const [dbError, setDbError] = useState<string | null>(null);

  const fetchStats = async () => {
    setLoading(true);
    setDbError(null);
    try {
      // 1. Get total counts
      const { count: termCount, error: termError } = await supabase
        .from("dictionary_terms")
        .select("*", { count: "exact", head: true });
      if (termError) throw termError;

      const { count: lessonCount, error: lessonError } = await supabase
        .from("lessons")
        .select("*", { count: "exact", head: true });
      if (lessonError) throw lessonError;

      // 2. Get user progress
      const { data: progress, error: progressError } = await supabase
        .from("user_progress")
        .select("item_type, status");
      if (progressError) throw progressError;

      const learned = progress?.filter(p => p.item_type === "term" && p.status === "done").length || 0;
      const completed = progress?.filter(p => p.item_type === "lesson" && p.status === "done").length || 0;

      setStats({
        totalTerms: termCount || 44,
        learnedTerms: learned,
        totalLessons: lessonCount || 4,
        completedLessons: completed,
      });

      // 3. Get a few terms to recommend
      // Fetch 3 terms that aren't marked learned
      const learnedIds = progress?.filter(p => p.item_type === "term" && p.status === "done").map(p => p.item_id) || [];
      
      let query = supabase.from("dictionary_terms").select("id, term, category, beginner_definition").limit(3);
      
      // If we have learned ids, filter them out
      if (learnedIds.length > 0) {
        query = query.not("id", "in", `(${learnedIds.join(",")})`);
      }
      
      const { data: terms, error: termsError } = await query;
      if (!termsError && terms) {
        setRecentTerms(terms);
      }
    } catch (err: any) {
      console.error("Error loading academy stats:", err);
      setDbError(err.message || "Failed to query database. Ensure Supabase is configured.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const completionRate = stats.totalTerms > 0 
    ? Math.round(((stats.learnedTerms + stats.completedLessons) / (stats.totalTerms + stats.totalLessons)) * 100) 
    : 0;

  return (
    <div className="min-h-screen bg-[#090a0f] text-slate-100 font-sans flex flex-col">
      {/* Top Navbar */}
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
          <Link href="/academy" className="text-indigo-400 hover:text-indigo-300">Dashboard</Link>
          <Link href="/academy/dictionary" className="text-slate-400 hover:text-slate-200">Dictionary</Link>
          <Link href="/academy/lessons" className="text-slate-400 hover:text-slate-200">Curriculum</Link>
          <Link href="/status" className="text-slate-400 hover:text-slate-200">API Status</Link>
        </div>
      </nav>

      <main className="flex-1 max-w-5xl w-full mx-auto p-6 md:p-8">
        {/* Banner */}
        <section className="mb-8 p-8 bg-gradient-to-br from-indigo-950/20 via-slate-900/10 to-transparent border border-indigo-900/10 rounded-2xl relative overflow-hidden">
          <div className="relative z-10">
            <h2 className="text-2xl font-bold text-slate-100 mb-2">Welcome to VIZIER Academy</h2>
            <p className="text-slate-400 text-sm max-w-xl leading-relaxed">
              Your command center for mastering Agentic AI engineering. Track definitions, study lessons, and complete workbook challenges directly in-app.
            </p>
          </div>
          {/* Glassy Background Flare */}
          <div className="absolute right-0 top-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl -z-10"></div>
        </section>

        {dbError && (
          <div className="mb-8 p-4 bg-rose-950/15 border border-rose-900/30 rounded-xl text-rose-400 text-sm font-mono flex items-center justify-between">
            <div>
              <strong className="block font-semibold mb-1">Database Error</strong>
              {dbError}
            </div>
            <button 
              onClick={fetchStats}
              className="px-3 py-1.5 bg-rose-900/30 hover:bg-rose-900/40 text-xs rounded border border-rose-900/50 cursor-pointer"
            >
              Retry
            </button>
          </div>
        )}

        {/* Stats Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
          {/* Completion Ring Card */}
          <div className="bg-slate-900/35 border border-slate-900 rounded-xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Overall Progress</h3>
            <div className="my-4 flex items-center gap-4">
              <div className="text-3xl font-extrabold text-indigo-400 font-mono">
                {loading ? "..." : `${completionRate}%`}
              </div>
              <div className="flex-1 bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-900">
                <div 
                  className="bg-indigo-500 h-full rounded-full transition-all duration-500" 
                  style={{ width: `${loading ? 0 : completionRate}%` }}
                ></div>
              </div>
            </div>
            <span className="text-slate-500 text-xxs font-mono">Academy learning completions</span>
          </div>

          {/* Dictionary Card */}
          <div className="bg-slate-900/35 border border-slate-900 rounded-xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Glossary Terms</h3>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-slate-200 font-mono">
                {loading ? "..." : `${stats.learnedTerms} `}
              </span>
              <span className="text-slate-500 text-sm">/ {stats.totalTerms} learned</span>
            </div>
            <Link href="/academy/dictionary" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold mt-2 inline-flex items-center gap-1 group">
              Browse Glossary 
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>

          {/* Curriculum Card */}
          <div className="bg-slate-900/35 border border-slate-900 rounded-xl p-6 flex flex-col justify-between">
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Lessons Finished</h3>
            <div className="my-2">
              <span className="text-3xl font-extrabold text-slate-200 font-mono">
                {loading ? "..." : `${stats.completedLessons} `}
              </span>
              <span className="text-slate-500 text-sm">/ {stats.totalLessons} completed</span>
            </div>
            <Link href="/academy/lessons" className="text-indigo-400 hover:text-indigo-300 text-xs font-semibold mt-2 inline-flex items-center gap-1 group">
              Read Curriculum 
              <span className="transition-transform group-hover:translate-x-0.5">→</span>
            </Link>
          </div>
        </section>

        {/* Continue Learning */}
        {!loading && recentTerms.length > 0 && (
          <section className="bg-slate-900/25 border border-slate-900/80 rounded-2xl p-6 mb-8">
            <h3 className="text-sm font-bold text-slate-300 mb-4 uppercase tracking-wider text-slate-500 text-xs">
              Suggested Next Terms
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {recentTerms.map((termItem) => (
                <div 
                  key={termItem.id} 
                  className="p-5 bg-slate-950/40 border border-slate-900/60 rounded-xl hover:border-slate-800 transition duration-200 flex flex-col justify-between"
                >
                  <div>
                    <span className="px-2 py-0.5 bg-slate-900 text-slate-400 border border-slate-800 text-xxs font-mono rounded">
                      {termItem.category}
                    </span>
                    <h4 className="text-base font-bold text-slate-200 mt-3 mb-2">{termItem.term}</h4>
                    <p className="text-slate-400 text-xs leading-relaxed line-clamp-3">
                      {termItem.beginner_definition}
                    </p>
                  </div>
                  <Link 
                    href={`/academy/dictionary?term=${encodeURIComponent(termItem.term)}`} 
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-semibold mt-4 block"
                  >
                    View in Dictionary
                  </Link>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
