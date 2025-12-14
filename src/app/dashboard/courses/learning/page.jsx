"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Quicksand, Montserrat } from "next/font/google";
import { FiCheck, FiAlertCircle, FiRefreshCw } from "react-icons/fi";
import { getJourneyDetail, getTutorialContent } from "@/lib/journeys";
import { trackTutorial, getTrackingSummary, updateUserSummary } from "@/lib/tracking";
import { useHeartbeat } from "@/hooks/useHeartbeat";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const progressKey = (courseId) => `ngotack-progress-${courseId}`;

function loadProgress(courseId) {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(progressKey(courseId)) || "null");
    if (stored && Array.isArray(stored.completedMaterialIds)) {
      return stored.completedMaterialIds;
    }
  } catch {
    //
  }
  return [];
}

function saveProgress(courseId, completedMaterialIds) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      progressKey(courseId),
      JSON.stringify({ completedMaterialIds })
    );
  } catch {
    //
  }
}

export default function LearningPage() {
  const container = "max-w-[1400px]";
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = searchParams.get("course");
  
  // State for data
  const [journey, setJourney] = useState(null);
  const [tutorials, setTutorials] = useState([]);
  const [activeTutorial, setActiveTutorial] = useState(null);
  const [activeTutorialId, setActiveTutorialId] = useState(null);
  
  // State for UI
  const [loadingJourney, setLoadingJourney] = useState(true);
  const [loadingContent, setLoadingContent] = useState(false);
  const [error, setError] = useState(null);
  const [completedMaterials, setCompletedMaterials] = useState([]);
  const [trackedStarts, setTrackedStarts] = useState(new Set()); // Track which tutorials have been marked as "start"
  
  // Use heartbeat hook for automatic activity tracking
  const { isTracking, isIdle, isTabVisible } = useHeartbeat(
    courseId ? parseInt(courseId) : null,
    activeTutorialId,
    !!activeTutorialId // Only track when there's an active tutorial
  );

  // Fetch Journey Details
  const fetchJourney = useCallback(async () => {
    if (!courseId) return;
    
    setLoadingJourney(true);
    setError(null);
    
    try {
      const result = await getJourneyDetail(courseId);
      
      if (result.success) {
        console.log("Journey Details Fetched:", result.data);
        console.log("🎯 exam_id:", result.data.exam_id);
        console.log("📝 exam_title:", result.data.exam_title);
        setJourney(result.data);
        // Handle both 'tutorial' (from API spec) and potentially 'tutorials' property names
        const tutorialList = result.data.tutorial || result.data.tutorials || [];
        setTutorials(tutorialList);
        
        // Determine initial active tutorial
        const paramMaterial = searchParams.get("m");
        const parsedParamId = paramMaterial ? parseInt(paramMaterial, 10) : null;
        
        if (parsedParamId && tutorialList.some(t => t.tutorial_id === parsedParamId)) {
          setActiveTutorialId(parsedParamId);
        } else if (tutorialList.length > 0) {
          setActiveTutorialId(tutorialList[0].tutorial_id);
        }
      } else {
        setError(result.error || "Gagal memuat detail kursus");
      }
    } catch (err) {
      console.error("Error fetching journey:", err);
      setError("Terjadi kesalahan saat memuat data kursus");
    } finally {
      setLoadingJourney(false);
    }
  }, [courseId, searchParams]);

  // Fetch Tutorial Content
  const fetchContent = useCallback(async () => {
    if (!activeTutorialId) return;
    
    setLoadingContent(true);
    
    try {
      const result = await getTutorialContent(activeTutorialId);
      
      if (result.success) {
        console.log("Tutorial Content Fetched:", result.data);
        setActiveTutorial(result.data);
      } else {
        // Fallback if content fetch fails but we have basic info from the list
        const basicInfo = tutorials.find(t => t.tutorial_id === activeTutorialId);
        if (basicInfo) {
          setActiveTutorial({
            ...basicInfo,
            content: "Gagal memuat konten lengkap. Silakan coba lagi."
          });
        }
      }
    } catch (err) {
      console.error("Error fetching tutorial content:", err);
    } finally {
      setLoadingContent(false);
    }
  }, [activeTutorialId, tutorials]);

  // Load progress from backend
  const loadProgressFromBackend = useCallback(async () => {
    try {
      const result = await getTrackingSummary();
      if (result.success && result.data) {
        // Backend returns summary with completed/inProgress counts
        // We need to get the actual list of completed tutorial IDs
        // For now, we'll keep localStorage as primary and sync later
        // TODO: Backend should provide list of completed tutorial IDs
        console.log('📊 Backend tracking summary:', result.data);
      }
    } catch (err) {
      console.warn('Failed to load progress from backend, using localStorage:', err);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    if (courseId) {
      fetchJourney();
      loadProgressFromBackend();
      const completed = loadProgress(courseId);
      setCompletedMaterials(completed);
    }
  }, [courseId, fetchJourney, loadProgressFromBackend]);

  // Load Content when active ID changes
  useEffect(() => {
    if (activeTutorialId) {
      fetchContent();
      
      // Track "start" if not already tracked
      if (!trackedStarts.has(activeTutorialId)) {
        trackTutorial(activeTutorialId, 'start').then(result => {
          if (result.success) {
            setTrackedStarts(prev => new Set([...prev, activeTutorialId]));
          }
        });
      }
      
      // Update URL without reloading
      const newUrl = `/dashboard/courses/learning?course=${courseId}&m=${activeTutorialId}`;
      window.history.replaceState({ ...window.history.state, as: newUrl, url: newUrl }, '', newUrl);
    }
  }, [activeTutorialId, courseId, fetchContent, trackedStarts]);

  // Derived state
  const completedSet = new Set(completedMaterials);
  const activeIndex = tutorials.findIndex((t) => t.tutorial_id === activeTutorialId);
  
  // Calculate progress
  // Note: This logic might need to be updated if backend provides progress
  let highestCompletedIndex = -1;
  tutorials.forEach((t, idx) => {
    if (completedSet.has(t.tutorial_id) && idx > highestCompletedIndex) {
      highestCompletedIndex = idx;
    }
  });

  const progress = tutorials.length > 0 
    ? Math.round((completedSet.size / tutorials.length) * 100) 
    : 0;

  function goToQuiz() {
    // Debug: Check journey data
    console.log('🎯 goToQuiz called - Journey data:', journey);
    console.log('🎯 exam_id value:', journey?.exam_id);
    
    // Validate exam_id exists
    if (!journey?.exam_id) {
      alert(`⚠️ Journey ini belum memiliki ujian yang dikonfigurasi.\n\nJourney ID: ${courseId}\nexam_id: ${journey?.exam_id || 'NULL'}\n\nSilakan hubungi admin.`);
      return;
    }
    
    router.push(`/dashboard/courses/learning/quiz?course=${courseId}&examId=${journey.exam_id}`);
  }

  function markCurrentAsComplete() {
    if (!activeTutorialId) return;
    
    // Track completion in backend
    trackTutorial(activeTutorialId, 'complete').catch(err => {
      console.warn('Failed to track completion in backend:', err);
    });
    
    // Update local state and localStorage as fallback
    setCompletedMaterials((prev) => {
      const set = new Set(prev);
      set.add(activeTutorialId);
      const arr = Array.from(set);
      saveProgress(courseId, arr);
      return arr;
    });
  }

  function handleNext() {
    if (activeIndex === -1) return;

    markCurrentAsComplete();

    // Update user summary after completing tutorial
    updateUserSummary().catch(err => {
      console.warn('Failed to update summary:', err);
      // Don't block navigation if summary update fails
    });

    if (activeIndex < tutorials.length - 1) {
      const nextId = tutorials[activeIndex + 1].tutorial_id;
      setActiveTutorialId(nextId);
    } else {
      // Last tutorial - navigate to quiz
      goToQuiz(); 
    }
  }

  function handlePrev() {
    if (activeIndex > 0) {
      setActiveTutorialId(tutorials[activeIndex - 1].tutorial_id);
    }
  }

  // Loading State
  if (loadingJourney) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D7B7]"></div>
          <p className={`${montserrat.className} text-gray-600`}>Memuat materi kursus...</p>
        </div>
      </div>
    );
  }

  // Error State
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md text-center">
          <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <FiAlertCircle className="text-red-600 text-xl" />
          </div>
          <h3 className={`${quicksand.className} text-xl font-bold text-gray-900 mb-2`}>
            Gagal Memuat Data
          </h3>
          <p className={`${montserrat.className} text-gray-600 mb-6`}>
            {error}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/dashboard/courses"
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Kembali
            </Link>
            <button
              onClick={fetchJourney}
              className="px-4 py-2 bg-[#36D7B7] text-white rounded-lg hover:bg-[#2cc2a5] transition-colors text-sm font-medium flex items-center gap-2"
            >
              <FiRefreshCw /> Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!journey || tutorials.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="text-center">
          <h3 className={`${quicksand.className} text-xl font-bold text-gray-900`}>
            Kursus Tidak Ditemukan
          </h3>
          <Link href="/dashboard/courses" className="text-[#36D7B7] hover:underline mt-2 block">
            Kembali ke Daftar Kursus
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9]">
      {/* HEADER */}
      <header className="w-full border-b border-gray-200 bg-white sticky top-0 z-10">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center`}>
          <Link
            href="/dashboard/courses"
            className={`${montserrat.className} inline-flex items-center text-sm text-black hover:text-[#36D7B7] transition-colors`}
          >
            <span className="mr-2">←</span> {journey.title}
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className={`${container} mx-auto px-6 lg:px-10 py-10 flex-1 w-full flex flex-col`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Konten */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px]">
            {loadingContent ? (
              <div className="h-full flex items-center justify-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#36D7B7]"></div>
              </div>
            ) : activeTutorial ? (
              <>
                <h1 className={`${quicksand.className} text-2xl md:text-3xl font-bold text-black mb-6`}>
                  {activeTutorial.title}
                </h1>

                <div className={`${montserrat.className} prose prose-slate max-w-none text-black leading-relaxed`}>
                  {/* Render content safely - assuming plain text or basic HTML for now */}
                  {/* If content is markdown or HTML, we might need a parser later */}
                  <div className="whitespace-pre-wrap">
                    {activeTutorial.content || "Konten belum tersedia."}
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-10 text-gray-500">
                Pilih materi untuk mulai belajar
              </div>
            )}
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6 h-fit sticky top-24">
            <h3 className={`${quicksand.className} text-lg font-semibold text-black mb-4`}>Daftar Materi</h3>

            <div className={`${montserrat.className} text-sm text-black`}>
              <div className="flex items-center justify-between mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden mb-6">
                <div
                  className="h-full bg-[#36D7B7] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2 custom-scrollbar">
                {tutorials.map((tutorial, index) => {
                  const isActive = tutorial.tutorial_id === activeTutorialId;
                  const isCompleted = completedSet.has(tutorial.tutorial_id);

                  // Allow clicking any previous or current item, or the immediate next one
                  // Or just allow clicking anything for better UX in this dynamic version?
                  // Let's stick to the "unlocking" logic for now if desired, or open for all.
                  // For now, let's make it open to navigate freely but visually indicate progress.
                  const canClick = true; 
                  // index <= highestCompletedIndex + 1 || tutorial.tutorial_id === activeTutorialId;

                  const baseClasses =
                    "flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-colors w-full text-left";

                  const bgColor = isActive
                    ? "bg-[#36D7B7] border-[#36D7B7] text-white"
                    : isCompleted
                    ? "bg-[#b7f0d4] border-[#7bd6b6] text-black"
                    : "bg-[#e5e7eb] border-[#d1d5db] text-black hover:bg-gray-200";

                  return (
                    <button
                      key={tutorial.tutorial_id}
                      type="button"
                      disabled={!canClick}
                      onClick={() => {
                        markCurrentAsComplete();
                        setActiveTutorialId(tutorial.tutorial_id);
                        
                        // Update summary when switching tutorials
                        updateUserSummary().catch(err => {
                          console.warn('Failed to update summary:', err);
                        });
                      }}
                      className={`${baseClasses} ${bgColor} ${
                        !canClick
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer"
                      }`}
                    >
                      <span className="truncate flex-1">{tutorial.title}</span>
                      {isCompleted && (
                        <span className="ml-2 inline-flex h-5 w-5 items-center justify-center rounded-full bg-white flex-shrink-0">
                          <FiCheck className="text-xs text-[#16a34a]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
              
              {/* Exam Panel - Show exam with dynamic title from Supabase */}
              {journey && journey.exam_id && (
                <div className="mt-6 pt-6 border-t border-gray-300">
                  <h4 className={`${quicksand.className} text-sm font-semibold text-black mb-3`}>Ujian Akhir</h4>
                  <button
                    type="button"
                    onClick={() => {
                      // Mark current tutorial as complete before going to quiz
                      markCurrentAsComplete();
                      
                      // Validate exam_id exists
                      if (!journey.exam_id) {
                        alert('⚠️ Journey ini belum memiliki ujian yang dikonfigurasi. Silakan hubungi admin.');
                        return;
                      }
                      
                      router.push(`/dashboard/courses/learning/quiz?course=${courseId}&examId=${journey.exam_id}`);
                    }}
                    className="flex items-center justify-between px-4 py-4 rounded-lg border-2 border-[#FFA500] bg-gradient-to-r from-[#FFF4E6] to-[#FFE4B5] text-black hover:shadow-md transition-all w-full text-left group"
                  >
                    <div className="flex items-center gap-3 flex-1">
                      <div className="flex-shrink-0 w-10 h-10 rounded-full bg-[#FFA500] flex items-center justify-center">
                        <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold text-sm">{journey.exam_title || 'Ujian Akhir'}</p>
                        <p className="text-xs text-gray-700 mt-0.5">Uji pemahaman Anda</p>
                      </div>
                    </div>
                    <svg className="w-5 h-5 text-[#FFA500] group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER NAV */}
      <footer className="border-t border-gray-200 bg-white mt-6 sticky bottom-0 z-10">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-between`}>
          <button
            type="button"
            disabled={activeIndex <= 0}
            onClick={handlePrev}
            className={`${montserrat.className} text-sm flex items-center gap-2 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:underline hover:-translate-x-[1px] transition`}
          >
            ← Materi Sebelumnya
          </button>

          <span className={`${quicksand.className} text-sm md:text-base font-semibold text-black hidden md:block`}>
            {activeTutorial ? activeTutorial.title : "Memuat..."}
          </span>

          <button
            type="button"
            onClick={handleNext}
            className={`${montserrat.className} text-sm flex items-center gap-2 text-black hover:underline hover:translate-x-[1px] transition`}
          >
            {activeIndex < tutorials.length - 1 ? "Materi Selanjutnya →" : "Selesaikan Kuis →"}
          </button>
        </div>
      </footer>
    </div>
  );
}
