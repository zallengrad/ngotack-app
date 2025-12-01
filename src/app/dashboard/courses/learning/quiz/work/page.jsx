"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Quicksand, Montserrat } from "next/font/google";
import { getCourseById } from "@/config/courses";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const QUIZ_DURATION_SECONDS = 10 * 60;

const resultKey = (courseId) => `ngotack-quiz-last-result-${courseId}`;
const historyKey = (courseId) => `ngotack-quiz-history-${courseId}`;
const progressKey = (courseId) => `ngotack-progress-${courseId}`;

function formatTime(seconds) {
  const m = String(Math.floor(seconds / 60)).padStart(2, "0");
  const s = String(seconds % 60).padStart(2, "0");
  return `${m}:${s}`;
}

function updateQuizProgress(courseId, passed, examMaterialId) {
  if (typeof window === "undefined") return;
  try {
    const stored = JSON.parse(localStorage.getItem(progressKey(courseId)) || "null") || {
      completedMaterialIds: [],
    };
    let ids = Array.isArray(stored.completedMaterialIds)
      ? [...stored.completedMaterialIds]
      : [];

    const idx = ids.indexOf(examMaterialId);
    if (passed) {
      if (idx === -1) ids.push(examMaterialId);
    } else if (idx !== -1) {
      ids.splice(idx, 1);
    }

    localStorage.setItem(progressKey(courseId), JSON.stringify({ completedMaterialIds: ids }));
  } catch {
    //
  }
}

function saveResultHistory(courseId, result) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(resultKey(courseId), JSON.stringify(result));
    const existing = JSON.parse(localStorage.getItem(historyKey(courseId)) || "[]");
    const updated = [result, ...existing];
    localStorage.setItem(historyKey(courseId), JSON.stringify(updated.slice(0, 20)));
  } catch {
    //
  }
}

export default function QuizWorkPage() {
  const container = "max-w-[1400px]";
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("course") || "frontend-basic";
  const course = useMemo(() => getCourseById(courseId), [courseId]);
  const questions = course.quizQuestions;
  const examMaterialId = course.materials[course.materials.length - 1].id;

  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(Array(questions.length).fill(null));
  const [timeLeft, setTimeLeft] = useState(QUIZ_DURATION_SECONDS);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      handleSubmit(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeLeft]);

  const currentQuestion = questions[currentIndex];
  const someUnanswered = answers.some((a) => a === null);
  const isLastQuestion = currentIndex === questions.length - 1;

  function selectOption(optionKey) {
    setAnswers((prev) => {
      const copy = [...prev];
      copy[currentIndex] = optionKey;
      return copy;
    });
  }

  function handleSubmit(auto = false) {
    if (isSubmitting) return;
    setIsSubmitting(true);

    const total = questions.length;
    let correct = 0;
    questions.forEach((q, index) => {
      if (answers[index] && answers[index] === q.correctOptionKey) {
        correct += 1;
      }
    });

    const score = Math.round((correct / total) * 100);
    const passed = score >= 80; // minimal 80
    const status = passed ? "Lulus" : "Tidak Lulus";
    const finishedAt = new Date().toISOString();

    const result = { score, status, finishedAt, autoSubmit: auto };

    updateQuizProgress(courseId, passed, examMaterialId);
    saveResultHistory(courseId, result);

    router.push(`/dashboard/courses/learning/quiz?course=${courseId}`);
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
            <span className="mr-2">←</span> {course.title}
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
                      key={q.id}
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
              {currentQuestion.question}
            </h1>

            <div className="space-y-4">
              {currentQuestion.options.map((opt) => {
                const isSelected = answers[currentIndex] === opt.key;
                return (
                  <button
                    key={opt.key}
                    type="button"
                    onClick={() => selectOption(opt.key)}
                    className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-colors ${
                      isSelected
                        ? "bg-[#36D7B7] border-[#36D7B7] text-white"
                        : "bg-[#b7f0d4] border-[#7bd6b6] text-black hover:bg-[#9beccf]"
                    }`}
                  >
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white text-sm font-semibold text-black">
                      {opt.key}.
                    </span>
                    <span className={`${montserrat.className} text-sm md:text-base`}>{opt.text}</span>
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
                disabled={isLastQuestion && someUnanswered}
                className={`${montserrat.className} inline-flex items-center gap-2 px-6 py-2 rounded-md bg-[#36D7B7] text-white text-sm font-semibold hover:bg-[#2bb399] disabled:opacity-40 disabled:cursor-not-allowed`}
              >
                {isLastQuestion ? "Selesai" : "Lanjut →"}
              </button>
            </div>
          </section>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-center`}>
          <span className={`${quicksand.className} text-sm md:text-base font-semibold text-black`}>
            Ujian Akhir
          </span>
        </div>
      </footer>
    </div>
  );
}
