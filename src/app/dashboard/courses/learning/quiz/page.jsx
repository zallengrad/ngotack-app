"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Quicksand, Montserrat } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

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

  const courseId = searchParams.get("course");
  const examId = searchParams.get("examId"); // No default fallback!

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;

    try {
      const hist = JSON.parse(localStorage.getItem(historyKey(courseId)) || "[]");
      setHistory(hist);
    } catch (err) {
      console.error("Failed to load quiz history", err);
    }
  }, [courseId]);

  async function handleStartExam() {
    setLoading(true);
    
    // ✅ Don't fetch exam data here - let QuizWorkPage handle it
    // This prevents duplicate API calls and 409 Conflict errors
    console.log(`🎯 Starting exam ${examId}...`);
    
    // Directly navigate to work page
    router.push(`/dashboard/courses/learning/quiz/work?course=${courseId}&examId=${examId}`);
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
            <span className="mr-2">←</span> Belajar Menjadi Front End Developer
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className={`${container} mx-auto px-6 lg:px-10 py-10 flex-1 w-full`}>
        {/* Content - Full Width without Sidebar */}
        <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-sm border border-gray-200 p-8">
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
                onClick={handleStartExam}
                disabled={loading}
                className="inline-flex items-center justify-center px-6 py-2 rounded-md bg-[#36D7B7] text-white text-sm font-semibold hover:bg-[#2bb399] transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Memuat...
                  </>
                ) : (
                  "Mulai"
                )}
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
