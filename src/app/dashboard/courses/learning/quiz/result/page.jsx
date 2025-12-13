"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { Quicksand, Montserrat } from "next/font/google";
import { FiCheck, FiX, FiClock, FiAward } from "react-icons/fi";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

function formatDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${minutes} menit ${secs} detik`;
}

export default function QuizResultPage() {
  const container = "max-w-[1400px]";
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const courseId = searchParams.get("course");
  const examId = searchParams.get("examId") || 1;
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Get result from localStorage (saved by work page after submission)
    try {
      const savedResult = localStorage.getItem(`exam-${examId}-result`);
      if (savedResult) {
        const parsedResult = JSON.parse(savedResult);
        console.log("📊 Loaded exam result:", parsedResult);
        setResult(parsedResult);
        setLoading(false);
      } else {
        setError("Hasil ujian tidak ditemukan. Silakan kembali ke halaman kursus.");
        setLoading(false);
      }
    } catch (err) {
      console.error("❌ Error loading result:", err);
      setError("Gagal memuat hasil ujian.");
      setLoading(false);
    }
  }, [examId]);

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="flex flex-col items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#36D7B7]"></div>
          <p className={`${montserrat.className} text-gray-600`}>Memuat hasil ujian...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error || !result) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f7f9]">
        <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 max-w-md text-center">
          <h3 className={`${quicksand.className} text-xl font-bold text-gray-900 mb-2`}>
            Hasil Tidak Ditemukan
          </h3>
          <p className={`${montserrat.className} text-gray-600 mb-6`}>
            {error || "Hasil ujian tidak ditemukan."}
          </p>
          <Link
            href={`/dashboard/courses/learning?course=${courseId}`}
            className="px-4 py-2 bg-[#36D7B7] text-white rounded-lg hover:bg-[#2cc2a5] transition-colors text-sm font-medium inline-block"
          >
            Kembali ke Kursus
          </Link>
        </div>
      </div>
    );
  }

  const isPassed = result.is_passed;
  const scorePercentage = result.score;
  const passingScore = result.passing_score || 75;

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9]">
      {/* HEADER */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center`}>
          <Link
            href={`/dashboard/courses/learning?course=${courseId}`}
            className={`${montserrat.className} inline-flex items-center text-sm text-black hover:text-[#36D7B7] transition-colors`}
          >
            <span className="mr-2">←</span> Kembali ke Kursus
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className={`${container} mx-auto px-6 lg:px-10 py-10 flex-1 w-full`}>
        <div className="max-w-3xl mx-auto">
          {/* Result Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 mb-6">
            {/* Status Badge */}
            <div className="flex justify-center mb-6">
              <div className={`inline-flex items-center gap-2 px-6 py-3 rounded-full ${
                isPassed 
                  ? "bg-green-100 text-green-800" 
                  : "bg-red-100 text-red-800"
              }`}>
                {isPassed ? (
                  <>
                    <FiCheck className="text-xl" />
                    <span className={`${quicksand.className} text-lg font-bold`}>LULUS</span>
                  </>
                ) : (
                  <>
                    <FiX className="text-xl" />
                    <span className={`${quicksand.className} text-lg font-bold`}>TIDAK LULUS</span>
                  </>
                )}
              </div>
            </div>

            {/* Title */}
            <h1 className={`${quicksand.className} text-2xl md:text-3xl font-bold text-center text-black mb-2`}>
              {isPassed ? "Selamat! Anda Berhasil Lulus" : "Ujian Selesai"}
            </h1>
            
            <p className={`${montserrat.className} text-center text-gray-600 mb-8`}>
              {isPassed 
                ? "Anda telah menyelesaikan ujian dengan baik!" 
                : "Jangan menyerah, coba lagi untuk hasil yang lebih baik!"}
            </p>

            {/* Score Display */}
            <div className="flex justify-center mb-8">
              <div className="text-center">
                <div className="relative inline-flex items-center justify-center">
                  <svg className="w-32 h-32 transform -rotate-90">
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke="#e5e7eb"
                      strokeWidth="8"
                      fill="none"
                    />
                    <circle
                      cx="64"
                      cy="64"
                      r="56"
                      stroke={isPassed ? "#36D7B7" : "#ef4444"}
                      strokeWidth="8"
                      fill="none"
                      strokeDasharray={`${(scorePercentage / 100) * 351.86} 351.86`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className={`${quicksand.className} text-4xl font-bold text-black`}>
                      {scorePercentage}
                    </span>
                    <span className={`${montserrat.className} text-sm text-gray-600`}>
                      / 100
                    </span>
                  </div>
                </div>
                <p className={`${montserrat.className} text-sm text-gray-600 mt-2`}>
                  Nilai Anda
                </p>
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-[#f9fafb] rounded-lg p-4 text-center border border-gray-200">
                <FiAward className="text-2xl text-[#36D7B7] mx-auto mb-2" />
                <p className={`${montserrat.className} text-sm text-gray-600 mb-1`}>
                  Jawaban Benar
                </p>
                <p className={`${quicksand.className} text-xl font-bold text-black`}>
                  {result.correct_answers} / {result.total_questions}
                </p>
              </div>

              <div className="bg-[#f9fafb] rounded-lg p-4 text-center border border-gray-200">
                <FiClock className="text-2xl text-[#36D7B7] mx-auto mb-2" />
                <p className={`${montserrat.className} text-sm text-gray-600 mb-1`}>
                  Waktu Pengerjaan
                </p>
                <p className={`${quicksand.className} text-xl font-bold text-black`}>
                  {formatDuration(result.duration_seconds || 0)}
                </p>
              </div>

              <div className="bg-[#f9fafb] rounded-lg p-4 text-center border border-gray-200">
                <FiCheck className="text-2xl text-[#36D7B7] mx-auto mb-2" />
                <p className={`${montserrat.className} text-sm text-gray-600 mb-1`}>
                  Nilai Minimal
                </p>
                <p className={`${quicksand.className} text-xl font-bold text-black`}>
                  {passingScore}
                </p>
              </div>
            </div>

            {/* Message */}
            <div className={`border rounded-lg p-4 mb-6 ${
              isPassed 
                ? "bg-green-50 border-green-200" 
                : "bg-orange-50 border-orange-200"
            }`}>
              <p className={`${montserrat.className} text-sm text-center ${
                isPassed ? "text-green-800" : "text-orange-800"
              }`}>
                {isPassed 
                  ? "Selamat! Anda telah menguasai materi dengan baik. Lanjutkan ke materi berikutnya!" 
                  : `Nilai Anda ${scorePercentage} belum mencapai nilai minimal ${passingScore}. Pelajari kembali materi untuk meningkatkan pemahaman Anda.`}
              </p>
            </div>

            {/* Action Button */}
            <div className="flex justify-center">
              <Link
                href={`/dashboard/courses/learning?course=${courseId}`}
                className={`${montserrat.className} inline-flex items-center justify-center px-6 py-3 rounded-lg bg-[#36D7B7] text-white text-sm font-semibold hover:bg-[#2bb399] transition-colors`}
              >
                Kembali ke Kursus
              </Link>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-center`}>
          <span className={`${quicksand.className} text-sm md:text-base font-semibold text-black`}>
            Hasil Ujian Akhir
          </span>
        </div>
      </footer>
    </div>
  );
}
