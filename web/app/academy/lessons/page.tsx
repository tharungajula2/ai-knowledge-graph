"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { renderMarkdown } from "@/lib/markdown";

interface Lesson {
  id: string;
  phase: number;
  order_index: number;
  title: string;
  body_markdown: string;
  competency_tag: string;
}

export default function LessonsPage() {
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [progress, setProgress] = useState<Record<string, string>>({}); // lessonId -> status
  const [loading, setLoading] = useState(true);
  const [selectedLesson, setSelectedLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Fetch lessons
      const { data: lessonsData, error: lessonsError } = await supabase
        .from("lessons")
        .select("*")
        .order("phase", { ascending: true })
        .order("order_index", { ascending: true });
      if (lessonsError) throw lessonsError;

      setLessons(lessonsData || []);

      // 2. Fetch progress
      const { data: progressData, error: progressError } = await supabase
        .from("user_progress")
        .select("item_id, status")
        .eq("item_type", "lesson");
      if (progressError) throw progressError;

      const progressMap: Record<string, string> = {};
      progressData?.forEach(p => {
        progressMap[p.item_id] = p.status;
      });
      setProgress(progressMap);

      // 3. Select first lesson as default
      if (lessonsData && lessonsData.length > 0) {
        setSelectedLesson(lessonsData[0]);
      }
    } catch (err: any) {
      console.error("Error loading curriculum:", err);
      setError(err.message || "Failed to load lessons data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const toggleLessonDone = async (lessonId: string) => {
    if (updating) return;
    setUpdating(true);
    const currentStatus = progress[lessonId];
    const newStatus = currentStatus === "done" ? "not_started" : "done";

    try {
      // Query if progress record already exists
      const { data: existing, error: queryError } = await supabase
        .from("user_progress")
        .select("id")
        .eq("item_type", "lesson")
        .eq("item_id", lessonId)
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
            item_type: "lesson",
            item_id: lessonId,
            status: newStatus,
            updated_at: new Date().toISOString()
          });
        if (insertError) throw insertError;
      }

      // Update local state map
      setProgress(prev => ({
        ...prev,
        [lessonId]: newStatus
      }));
    } catch (err: any) {
      console.error("Error updating progress:", err);
      alert("Failed to update lesson status: " + err.message);
    } finally {
      setUpdating(false);
    }
  };

  // Group lessons by Phase
  const groupedLessons: Record<number, Lesson[]> = {};
  lessons.forEach(l => {
    if (!groupedLessons[l.phase]) {
      groupedLessons[l.phase] = [];
    }
    groupedLessons[l.phase].push(l);
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
          <Link href="/academy/dictionary" className="text-slate-400 hover:text-slate-200">Dictionary</Link>
          <Link href="/academy/lessons" className="text-indigo-400 hover:text-indigo-300">Curriculum</Link>
          <Link href="/status" className="text-slate-400 hover:text-slate-200">API Status</Link>
        </div>
      </nav>

      {/* Main Dual-Column Panel */}
      <div className="flex-1 max-w-6xl w-full mx-auto p-4 md:p-6 flex flex-col md:flex-row gap-6 overflow-hidden">
        {/* Left Column: Syllabus Tree */}
        <section className="w-full md:w-80 flex flex-col bg-slate-900/10 border border-slate-900 rounded-xl p-4 h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] overflow-y-auto">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-4 pb-2 border-b border-slate-900">
            Course Curriculum
          </h3>
          
          {loading ? (
            <div className="text-center text-xs text-slate-500 py-8">Loading syllabus...</div>
          ) : Object.keys(groupedLessons).length === 0 ? (
            <div className="text-center text-xs text-slate-500 py-8">No lessons registered.</div>
          ) : (
            <div className="space-y-6">
              {Object.keys(groupedLessons).map(phaseKey => {
                const phaseNum = Number(phaseKey);
                return (
                  <div key={phaseNum}>
                    <h4 className="text-xxs font-extrabold text-slate-450 tracking-wider uppercase mb-2">
                      Phase {phaseNum}
                    </h4>
                    <div className="space-y-1 pl-1">
                      {groupedLessons[phaseNum].map((l) => {
                        const isSelected = selectedLesson?.id === l.id;
                        const isCompleted = progress[l.id] === "done";
                        return (
                          <button
                            key={l.id}
                            onClick={() => setSelectedLesson(l)}
                            className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between transition border cursor-pointer ${
                              isSelected
                                ? "bg-slate-900/40 border-slate-800 text-slate-100 font-semibold"
                                : "bg-transparent border-transparent hover:bg-slate-900/20 text-slate-450 hover:text-slate-300"
                            }`}
                          >
                            <span className="text-xs truncate mr-2">{l.title}</span>
                            {isCompleted && (
                              <span className="px-1.5 py-0.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[9px] font-bold rounded">
                                Done
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Right Column: Markdown Content viewer */}
        <section className="flex-1 bg-slate-900/10 border border-slate-900 rounded-xl p-6 flex flex-col justify-between h-[calc(100vh-140px)] md:h-[calc(100vh-120px)] overflow-y-auto">
          {error ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 font-mono text-sm">
              {error}
            </div>
          ) : !selectedLesson ? (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-sm">
              Select a lesson from the syllabus tree to start reading.
            </div>
          ) : (
            <div className="flex-1 flex flex-col justify-between gap-6">
              {/* Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-900 pb-4 mb-6">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xxs font-mono text-slate-500 bg-slate-950 px-2 py-0.5 border border-slate-900 rounded">
                      Phase {selectedLesson.phase} · Lesson {selectedLesson.order_index}
                    </span>
                    <span className="text-[10px] font-mono text-indigo-400 bg-indigo-500/5 px-2 py-0.5 border border-indigo-500/10 rounded">
                      Tag: {selectedLesson.competency_tag}
                    </span>
                  </div>
                  <h2 className="text-xl font-extrabold text-slate-100 mt-3">{selectedLesson.title}</h2>
                </div>
                <div>
                  <button
                    onClick={() => toggleLessonDone(selectedLesson.id)}
                    disabled={updating}
                    className={`px-4 py-2 text-xs font-bold rounded-lg border transition duration-200 cursor-pointer ${
                      progress[selectedLesson.id] === "done"
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30 hover:bg-emerald-500/20"
                        : "bg-indigo-600 hover:bg-indigo-500 text-white border-transparent"
                    }`}
                  >
                    {progress[selectedLesson.id] === "done" ? "✓ Completed" : "Mark Complete"}
                  </button>
                </div>
              </div>

              {/* Renders dynamic markdown content using our helper */}
              <div className="flex-1 min-h-60 bg-slate-950/20 p-5 md:p-8 rounded-xl border border-slate-900/60 overflow-y-auto mb-4 select-text">
                {renderMarkdown(selectedLesson.body_markdown)}
              </div>
              
              {/* Navigate Footer */}
              <div className="flex items-center justify-between border-t border-slate-900 pt-4 text-xs font-semibold text-slate-500">
                <span>VIZIER Academy System</span>
                <span className="font-mono">Page {selectedLesson.order_index}</span>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
