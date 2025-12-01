"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Quicksand, Montserrat } from "next/font/google";
import { FiCheck } from "react-icons/fi";
import { COURSES, getCourseById } from "@/config/courses";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const progressKey = (courseId) => `ngotack-progress-${courseId}`;
const historyKey = (courseId) => `ngotack-quiz-history-${courseId}`;

function formatDateTime(isoString) {
  if (!isoString) return "-";
  const date = new Date(isoString);
  return date.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export default function QuizIntroPage() {
  const container = "max-w-[1400px]";
  const router = useRouter();
  const searchParams = useSearchParams();

  const courseId = searchParams.get("course") || "frontend-basic";
  const course = useMemo(() => getCourseById(courseId), [courseId]);
  const materials = course.materials;
  const examMaterialId = materials[materials.length - 1].id;

  const [completedMaterials, setCompletedMaterials] = useState([]);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const progress = JSON.parse(localStorage.getItem(progressKey(courseId)) || "null");
      if (progress && Array.isArray(progress.completedMaterialIds)) {
        setCompletedMaterials(progress.completedMaterialIds);
      }

      const hist = JSON.parse(localStorage.getItem(historyKey(courseId)) || "[]");
      setHistory(hist);
    } catch (err) {
      console.error("Failed to load quiz data", err);
    }
  }, [courseId]);

  const completedSet = new Set(completedMaterials);
  const progress = Math.round((completedSet.size / materials.length) * 100);

  function goToMaterial(id) {
    if (id === examMaterialId) return;
    router.push(`/dashboard/courses/learning?course=${courseId}&m=${id}`);
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9]">
      {/* HEADER */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center`}>
          <Link
            href={`/dashboard/courses/learning?course=${courseId}`}
            className={`${montserrat.className} inline-flex items-center text-sm text-black`}
          >
            <span className="mr-2">←</span> {course.title}
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className={`${container} mx-auto px-6 lg:px-10 py-10 flex-1 w-full flex flex-col`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Aturan + Riwayat */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className={`${quicksand.className} text-2xl md:text-3xl font-bold text-black mb-4`}>
              Ujian Akhir
            </h1>

            <div className={`${montserrat.className} text-sm md:text-base text-black leading-relaxed`}>
              <h2 className="font-semibold text-base md:text-lg mb-3">Aturan</h2>
              <ul className="list-disc pl-5 space-y-2 mb-8">
                <li>Tes ini wajib diikuti untuk kelulusan kelas.</li>
                <li>Jumlah pertanyaan 5.</li>
                <li>Waktu pengerjaan 10 menit.</li>
                <li>Kelulusan ditentukan jika nilai minimal 80.</li>
              </ul>

              <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-[#f9fafb]">
                Silahkan klik tombol mulai untuk memulai ujian.
              </div>

              <div className="flex justify-end mb-10">
                <button
                  type="button"
                  onClick={() =>
                    router.push(`/dashboard/courses/learning/quiz/work?course=${courseId}`)
                  }
                  className="inline-flex items-center justify-center px-6 py-2 rounded-md bg-[#36D7B7] text-white text-sm font-semibold hover:bg-[#2bb399] transition-colors"
                >
                  Mulai
                </button>
              </div>

              {history.length > 0 && (
                <>
                  <h2 className={`${quicksand.className} text-lg font-semibold text-black mb-4`}>Riwayat</h2>
                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-200 text-sm">
                      <thead className="bg-[#f3f4f6]">
                        <tr>
                          <th className="px-4 py-2 border-b text-left">Tanggal</th>
                          <th className="px-4 py-2 border-b text-left">Nilai</th>
                          <th className="px-4 py-2 border-b text-left">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {history.map((item, idx) => (
                          <tr key={idx} className="border-b">
                            <td className="px-4 py-3 text-black">{formatDateTime(item.finishedAt)}</td>
                            <td className="px-4 py-3 text-black">{item.score}</td>
                            <td className="px-4 py-3 text-black">{item.status}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className={`${quicksand.className} text-lg font-semibold text-black mb-4`}>Daftar Materi</h3>

            <div className={`${montserrat.className} text-sm text-black`}>
              <div className="flex items-center justify-between mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden mb-6">
                <div className="h-full bg-[#36D7B7]" style={{ width: `${progress}%` }} />
              </div>

              <div className="space-y-3">
                {materials.map((material) => {
                  const isCompleted = completedSet.has(material.id);
                  const isExam = material.id === examMaterialId;

                  const bgColor = isCompleted
                    ? "bg-[#b7f0d4] border-[#7bd6b6] text-black"
                    : "bg-[#e5e7eb] border-[#d1d5db] text-black";

                  return (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => goToMaterial(material.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm w-full text-left cursor-pointer hover:bg-[#c6f5dd] ${bgColor}`}
                    >
                      <span className="truncate">{material.title}</span>
                      <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                        {isExam && !isCompleted ? (
                          <span className="text-xs font-semibold text-black">?</span>
                        ) : (
                          <FiCheck className="text-base text-[#16a34a]" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white mt-6">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-center`}>
          <span className={`${quicksand.className} text-sm md:text-base font-semibold text-black`}>
            Ujian Akhir
          </span>
        </div>
      </footer>
    </div>
  );
}
