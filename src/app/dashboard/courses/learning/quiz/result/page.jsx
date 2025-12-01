"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Quicksand, Montserrat } from "next/font/google";
import { FiCheck } from "react-icons/fi";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const STORAGE_RESULT_KEY = "ngotack-quiz-last-result";
const STORAGE_HISTORY_KEY = "ngotack-quiz-history";
const STORAGE_PROGRESS_KEY = "ngotack-course-progress";

const materials = [
  { id: 1, title: "Pengenalan Front End Developer" },
  { id: 2, title: "HTML Dasar" },
  { id: 3, title: "CSS Dasar" },
  { id: 4, title: "JavaScript Dasar" },
  { id: 5, title: "Project Mini" },
  { id: 6, title: "Ujian Akhir" },
];

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

export default function QuizResultPage() {
  const container = "max-w-[1400px]";
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [completedMaterials, setCompletedMaterials] = useState([]);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const last = JSON.parse(localStorage.getItem(STORAGE_RESULT_KEY) || "null");
      const hist = JSON.parse(localStorage.getItem(STORAGE_HISTORY_KEY) || "[]");
      const progress = JSON.parse(localStorage.getItem(STORAGE_PROGRESS_KEY) || "null");

      setResult(last);
      setHistory(hist);

      if (progress && Array.isArray(progress.completedMaterialIds)) {
        setCompletedMaterials(progress.completedMaterialIds);
      }
    } catch (error) {
      // kalau gagal parse, ya sudah, biarin kosong
      console.error("Failed to load quiz data from localStorage", error);
    }
  }, []);

  const completedSet = new Set(completedMaterials);
  const progress = Math.round((completedSet.size / materials.length) * 100);

  const titleText =
    result && result.status === "Lulus" ? "Selamat anda berhasil lulus ujian akhir!" : "Ujian akhir telah selesai";

  function goToMaterial(id) {
    if (id === 6) {
      router.push("/dashboard/courses/learning/quiz");
    } else {
      router.push(`/dashboard/courses/learning?m=${id}`);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9]">
      {/* HEADER SEDERHANA */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center`}>
          <Link
            href="/dashboard/courses/learning"
            className={`${montserrat.className} inline-flex items-center text-sm text-black`}
          >
            <span className="mr-2">←</span> Belajar Menjadi Front End Developer
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className={`${container} mx-auto px-6 lg:px-10 py-10 flex-1 w-full flex flex-col`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Hasil ujian + riwayat */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className={`${quicksand.className} text-2xl md:text-3xl font-bold text-black mb-4`}>
              {titleText}
            </h1>

            {result && (
              <p className={`${montserrat.className} text-sm md:text-base text-black mb-4`}>
                Nilai kamu: <span className="font-semibold">{result.score}</span> &nbsp;|&nbsp; Status:{" "}
                <span className="font-semibold">{result.status}</span>
              </p>
            )}

            <p className={`${montserrat.className} text-sm md:text-base text-black mb-6`}>
              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
              dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
              ex ea commodo consequat.
            </p>

            <div className="border border-gray-300 rounded-lg p-4 mb-6 bg-[#f9fafb]">
              <span className={`${montserrat.className} text-sm md:text-base text-black`}>
                Silahkan klik tombol mulai untuk memulai ujian ulang.
              </span>
            </div>

            <div className="flex justify-end mb-10">
              <button
                type="button"
                onClick={() => router.push("/dashboard/courses/learning/quiz/work")}
                className="inline-flex items-center justify-center px-6 py-2 rounded-md bg-[#36D7B7] text-white text-sm font-semibold hover:bg-[#2bb399] transition-colors"
              >
                Mulai
              </button>
            </div>

            {/* Riwayat – hanya muncul kalau sudah pernah ujian */}
            {history.length > 0 && (
              <>
                <h2 className={`${quicksand.className} text-lg font-semibold text-black mb-4`}>Riwayat</h2>
                <div className="overflow-x-auto">
                  <table className="min-w-full border border-gray-200 text-sm">
                    <thead className="bg-[#f3f4f6]">
                      <tr className={`${montserrat.className} text-black`}>
                        <th className="px-4 py-2 border-b text-left">Tanggal</th>
                        <th className="px-4 py-2 border-b text-left">Nilai</th>
                        <th className="px-4 py-2 border-b text-left">Status</th>
                      </tr>
                    </thead>
                    <tbody className={`${montserrat.className}`}>
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

          {/* Sidebar daftar materi – pakai progress asli dari localStorage */}
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
                  return (
                    <button
                      key={material.id}
                      type="button"
                      onClick={() => goToMaterial(material.id)}
                      className={`flex items-center justify-between px-4 py-3 rounded-lg border text-sm w-full text-left ${
                        isCompleted
                          ? "bg-[#b7f0d4] border-[#7bd6b6] text-black"
                          : "bg-[#e5e7eb] border-[#d1d5db] text-black"
                      }`}
                    >
                      <span className="truncate">{material.title}</span>
                      {isCompleted && (
                        <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                          <FiCheck className="text-base text-[#16a34a]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER: label ujian */}
      <footer className="border-t border-gray-200 bg-white mt-6">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-center`}>
          <span className={`${quicksand.className} text-sm md:text-base font-semibold text-black`}>Ujian Akhir</span>
        </div>
      </footer>
    </div>
  );
}
