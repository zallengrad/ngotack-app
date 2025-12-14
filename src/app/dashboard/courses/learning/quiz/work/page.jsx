"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Quicksand, Montserrat } from "next/font/google";
import { getExamQuestions, submitExamAnswers } from "@/lib/exams";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

export default function QuizWorkPage() {
  const container = "max-w-[1400px]";
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("course");
  const examId = searchParams.get("examId"); // No default fallback!

  // Exam data from backend
  const [examData, setExamData] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Quiz state
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // ✅ Prevent duplicate API calls (React Strict Mode fix)
  const hasFetchedRef = useRef(false);
  const isFetchingRef = useRef(false);

  // Fetch exam data on mount
  useEffect(() => {
    // ✅ Prevent duplicate calls in React Strict Mode
    if (hasFetchedRef.current || isFetchingRef.current) {
      console.log("⏭️ Skipping duplicate fetch (already fetched or in progress)");
      return;
    }

    async function fetchExam() {
      // Mark as fetching
      isFetchingRef.current = true;
      setLoading(true);
      
      try {
        console.log(`📝 Fetching exam ${examId} for quiz work page...`);
        
        // Try to get from localStorage first (for 409 conflict cases)
        const cachedExam = localStorage.getItem(`exam-${examId}-data`);
        
        const result = await getExamQuestions(examId);
        
        if (result.success && result.data) {
          console.log("✅ Exam data loaded:", result.data);
          const { exam, questions: examQuestions } = result.data;
          
          // Cache exam data for future use
          localStorage.setItem(`exam-${examId}-data`, JSON.stringify(result.data));
          
          setExamData(exam);
          setQuestions(examQuestions || []);
          setAnswers(Array(examQuestions?.length || 0).fill(null));
          
          // Set timer from backend (remaining_seconds or duration_seconds)
          const duration = exam.remaining_seconds || exam.duration_seconds || 600;
          setTimeLeft(duration);
          
          // Save start time for duration calculation
          const startTime = new Date().toISOString();
          localStorage.setItem(`exam-${examId}-start-time`, startTime);
          console.log('⏰ Exam start time saved:', startTime);
          
          // Mark as successfully fetched
          hasFetchedRef.current = true;
          setLoading(false);
        } else if (result.error && result.error.includes("Konflik")) {
          // 409 Conflict - exam already started
          console.log("⚠️ 409 Conflict detected - exam already started");
          
          if (cachedExam) {
            // Use cached data if available
            console.log("✅ Using cached exam data");
            const cachedData = JSON.parse(cachedExam);
            const { exam, questions: examQuestions } = cachedData;
            
            setExamData(exam);
            setQuestions(examQuestions || []);
            setAnswers(Array(examQuestions?.length || 0).fill(null));
            
            // Use full duration since we don't know remaining time
            const duration = exam.duration_seconds || 600;
            setTimeLeft(duration);
            
            // Mark as successfully fetched
            hasFetchedRef.current = true;
            setLoading(false);
          } else {
            // No cached data - show helpful error
            console.error("❌ No cached data available for already-started exam");
            setError("Ujian ini sudah pernah dimulai sebelumnya. Silakan hubungi admin untuk reset ujian atau kembali ke halaman kursus.");
            setLoading(false);
          }
        } else {
          console.error("❌ Failed to load exam:", result.error);
          setError(result.error || "Gagal memuat soal ujian");
          setLoading(false);
        }
      } catch (err) {
        console.error("❌ Error fetching exam:", err);
        setError("Terjadi kesalahan saat memuat ujian");
        setLoading(false);
      } finally {
        // Reset fetching flag
        isFetchingRef.current = false;
      }
    }

    fetchExam();
  }, [examId]);

  // Timer countdown
  useEffect(() => {
    if (loading || !examData) return;
    
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft, loading, examData]);

  const currentQuestion = questions[currentIndex];
  const someUnanswered = answers.some((a) => a === null);
  const isLastQuestion = currentIndex === questions.length - 1;

  function selectOption(optionValue) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = optionValue;
      return copy;
    });
  }

  async function handleSubmit(auto = false) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    try {
      // Prepare answers in backend format
      const formattedAnswers = answers.map((answer, index) => ({
        question_no: index + 1,
        selected_option: answer || ""
      }));

      console.log("📤 Submitting exam answers:", formattedAnswers);
      
      const result = await submitExamAnswers(examId, formattedAnswers);
      
      if (result.success && result.data) {
        console.log("✅ Exam submitted successfully:", result.data);
        
        // Save result to localStorage for result page
        localStorage.setItem(`exam-${examId}-result`, JSON.stringify(result.data));
        
        // Navigate to result page with result data
        router.push(`/dashboard/courses/learning/quiz/result?course=${courseId}&examId=${examId}`);
      } else {
        console.error("❌ Failed to submit exam:", result.error);
        alert("Gagal mengirim jawaban. Silakan coba lagi.");
        setIsSubmitting(false);
      }
    } catch (error) {
      console.error("❌ Error submitting exam:", error);
      alert("Terjadi kesalahan saat mengirim jawaban.");
      setIsSubmitting(false);
    }
  }

  function goNext() {
    if (isLastQuestion) {
      if (!someUnanswered) {
        handleSubmit(false);
      }
      return;
    }
    setCurrentIndex((i) => i + 1);
  }

  function goPrev() {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  }

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D7B7]"></div>
          <p className={`${montserrat.className} text-gray-600`}>Memuat soal ujian...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md text-center">
          <h3 className={`${quicksand.className} text-xl font-bold text-gray-900 mb-2`}>
            Gagal Memuat Ujian
          </h3>
          <p className={`${montserrat.className} text-gray-600 mb-6`}>{error}</p>
          <button
            onClick={() => router.push(`/dashboard/courses/learning/quiz?course=${courseId}&examId=${examId}`)}
            className="px-4 py-2 bg-[#36D7B7] text-white rounded-lg hover:bg-[#2cc2a5] transition-colors text-sm font-medium"
          >
            Kembali
          </button>
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="text-center">
          <h3 className={`${quicksand.className} text-xl font-bold text-gray-900`}>
            Tidak ada soal ujian
          </h3>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9]">
      {/* HEADER */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-between`}>
          <button
            type="button"
            onClick={() => router.push(`/dashboard/courses/learning?course=${courseId}`)}
            className={`${montserrat.className} inline-flex items-center text-sm text-black`}
          >
            <span className="mr-2">←</span> {examData?.title || "Ujian Akhir"}
          </button>

          <div
            className={`${montserrat.className} text-sm md:text-base px-4 py-2 rounded-lg border border-[#36D7B7] bg-[#f5fffc] text-black`}
          >
            Waktu Pengerjaan&nbsp;&nbsp;
            <span className="font-semibold">{formatTime(timeLeft)}</span>
          </div>
        </div>
      </header>

      {/* MAIN */}
      <main className={`${container} mx-auto px-6 lg:px-10 py-10 flex-1 w-full flex flex-col`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Nomor soal */}
          <aside className="w-full md:w-64">
            <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
              <p className={`${quicksand.className} text-base font-semibold mb-4 text-black`}>Nomor</p>
              <div className="flex flex-wrap gap-3">
                {questions.map((q, index) => {
                  const isActive = index === currentIndex;
                  const isAnswered = answers[index] !== null;

                  let cls =
                    "w-10 h-10 rounded-md text-sm font-semibold flex items-center justify-center border transition-colors ";

                  if (isActive) {
                    cls += "bg-[#36D7B7] border-[#36D7B7] text-white";
                  } else if (isAnswered) {
                    cls += "bg-[#b7f0d4] border-[#7bd6b6] text-black hover:bg-[#9beccf]";
                  } else {
                    cls += "bg-white border-gray-300 text-black hover:bg-[#f3f4f6]";
                  }

                  return (
                    <button
                      key={q.question_no || index}
                      type="button"
                      onClick={() => setCurrentIndex(index)}
                      className={cls}
                    >
                      {index + 1}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Soal */}
          <section className="flex-1 bg-white rounded-xl border border-gray-200 p-8 shadow-sm">
            <h1 className={`${quicksand.className} text-lg md:text-xl font-semibold mb-6 text-black`}>
              Peran utama seorang {currentQuestion?.question_text || "Loading..."}
            </h1>

            <div className="space-y-4">
              {["a", "b", "c", "d"].map((optionKey) => {
                const optionField = `option_${optionKey}`;
                const optionText = currentQuestion?.[optionField];
                
                if (!optionText) return null;
                
                const isSelected = answers[currentIndex] === optionText;
                
                return (
                  <button
                    key={optionKey}
                    type="button"
                    onClick={() => selectOption(optionText)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? "bg-[#36D7B7] border-[#36D7B7] text-white"
                        : "bg-[#b7f0d4] border-[#7bd6b6] text-black hover:bg-[#9beccf]"
                    }`}
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-sm font-semibold text-black">
                      {optionKey}.
                    </span>
                    <span className={`${montserrat.className} text-sm md:text-base`}>{optionText}</span>
                  </button>
                );
              })}
            </div>

            <div className="mt-10 flex items-center justify-between">
              <button
                type="button"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className={`${montserrat.className} inline-flex items-center gap-2 px-6 py-2 rounded-md border border-[#36D7B7] text-sm font-semibold text-[#36D7B7] bg-white disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[#e0fbf5]`}
              >
                ← Sebelumnya
              </button>

              <button
                type="button"
                onClick={goNext}
                disabled={(isLastQuestion && someUnanswered) || isSubmitting}
                className={`${montserrat.className} inline-flex items-center gap-2 px-6 py-2 rounded-md bg-[#36D7B7] text-white text-sm font-semibold hover:bg-[#2bb399] disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isSubmitting ? "Mengirim..." : isLastQuestion ? "Selesai" : "Lanjut →"}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-center`}>
          <span className={`${quicksand.className} text-sm md:text-base font-semibold text-black`}>
            {examData?.title || "Ujian Akhir"}
          </span>
        </div>
      </footer>
    </div>
  );
}
