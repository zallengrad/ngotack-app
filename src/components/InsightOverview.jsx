"use client";

import { Quicksand, Montserrat } from "next/font/google";
import { 
  FiTrendingUp, 
  FiTarget, 
  FiAward, 
  FiClock, 
  FiBookOpen,
  FiCheckCircle,
  FiAlertCircle,
  FiInfo
} from "react-icons/fi";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

// Helper function to get classification color
function getClassificationColor(classification) {
  const colors = {
    "Fast Learner": "bg-gradient-to-r from-purple-500 to-pink-500",
    "Consistent Learner": "bg-gradient-to-r from-green-500 to-teal-500",
    "Reflective Learner": "bg-gradient-to-r from-blue-500 to-indigo-500",
    "Newcomer": "bg-gradient-to-r from-yellow-500 to-orange-500",
    "Anomaly Detected": "bg-gradient-to-r from-red-500 to-orange-500"
  };
  return colors[classification] || "bg-gradient-to-r from-gray-500 to-gray-600";
}

// Helper function to get confidence badge color
function getConfidenceBadgeColor(confidence) {
  if (confidence >= 90) return "bg-green-100 text-green-800 border-green-300";
  if (confidence >= 70) return "bg-blue-100 text-blue-800 border-blue-300";
  if (confidence >= 50) return "bg-yellow-100 text-yellow-800 border-yellow-300";
  return "bg-red-100 text-red-800 border-red-300";
}

// Loading Skeleton Component
function LoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Hero Skeleton */}
      <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-8">
        <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="h-12 bg-gray-200 rounded w-2/3 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      </div>

      {/* Cards Skeleton */}
      <div className="grid md:grid-cols-2 gap-6">
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-5/6"></div>
        </div>
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
          <div className="h-6 bg-gray-200 rounded w-1/2 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-200 rounded w-4/6"></div>
        </div>
      </div>

      {/* Stats Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white border border-gray-300 rounded-xl shadow-sm p-4">
            <div className="h-4 bg-gray-200 rounded w-2/3 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Error State Component
function ErrorState({ error }) {
  return (
    <div className="bg-white border border-red-300 rounded-xl shadow-sm p-8 text-center">
      <FiAlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
      <h3 className={`${quicksand.className} text-2xl font-bold text-gray-900 mb-2`}>
        Gagal Memuat Insights
      </h3>
      <p className="text-gray-600 mb-4">
        {error || "Terjadi kesalahan saat mengambil data AI Insights."}
      </p>
      <button
        onClick={() => window.location.reload()}
        className="px-6 py-2 bg-[#36D7B7] text-white rounded-lg hover:bg-[#2ab89a] transition-colors"
      >
        Coba Lagi
      </button>
    </div>
  );
}

// Empty/Newcomer State Component
function NewcomerState({ userName }) {
  return (
    <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-8 text-center">
      <div className="w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-400 rounded-full flex items-center justify-center mx-auto mb-4">
        <span className="text-4xl">🚀</span>
      </div>
      <h3 className={`${quicksand.className} text-2xl font-bold text-gray-900 mb-2`}>
        Selamat Datang, {userName}!
      </h3>
      <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
        Mulai perjalanan belajarmu sekarang! AI kami akan menganalisis gaya belajarmu 
        setelah kamu menyelesaikan beberapa materi. Semakin banyak kamu belajar, 
        semakin akurat insight yang kami berikan.
      </p>
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
        <FiInfo className="w-5 h-5" />
        <span className="text-sm font-medium">
          Selesaikan minimal 2 materi untuk mendapatkan AI Insights pertamamu
        </span>
      </div>
    </div>
  );
}

// Main InsightOverview Component
export default function InsightOverview({
  learningProfile = null,
  progressSummary = null,
  loading = false,
  error = null,
  userName = "User"
}) {
  // Loading State
  if (loading) {
    return <LoadingSkeleton />;
  }

  // Error State
  if (error) {
    return <ErrorState error={error} />;
  }

  // Empty/Newcomer State
  if (!learningProfile || learningProfile.classification === "Newcomer") {
    return <NewcomerState userName={userName} />;
  }

  const {
    classification,
    title,
    message,
    action,
    confidence,
    data_stability,
    disclaimer
  } = learningProfile;

  const classificationColor = getClassificationColor(classification);
  const confidenceNum = typeof confidence === 'string' 
    ? parseFloat(confidence) 
    : confidence || 0;
  const confidenceBadgeColor = getConfidenceBadgeColor(confidenceNum);

  return (
    <section className="space-y-6">
      {/* Hero Section - Classification & Title */}
      <div className={`${classificationColor} text-white rounded-xl shadow-lg p-8`}>
        <div className="flex items-center gap-3 mb-4">
          <FiAward className="w-8 h-8" />
          <span className={`${montserrat.className} text-lg font-semibold opacity-90`}>
            Profil Gaya Belajar
          </span>
        </div>
        <h2 className={`${quicksand.className} text-4xl font-bold mb-3`}>
          {title || classification}
        </h2>
        <div className="flex flex-wrap items-center gap-3">
          <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
            <span className="font-semibold">{classification}</span>
          </div>
          {confidenceNum > 0 && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <FiTrendingUp className="w-4 h-4" />
              <span className="font-semibold">Confidence: {confidenceNum.toFixed(1)}%</span>
            </div>
          )}
          {data_stability && (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/20 backdrop-blur-sm rounded-full border border-white/30">
              <FiCheckCircle className="w-4 h-4" />
              <span className="font-semibold">Stabilitas: {data_stability}</span>
            </div>
          )}
        </div>
      </div>

      {/* Insight Message & Action Cards */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* Insight Message Card */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm">
          <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-200">
            <FiBookOpen className="text-lg text-gray-800" />
            <span className={`${montserrat.className} text-lg font-semibold text-gray-800`}>
              Analisis AI
            </span>
          </div>
          <div className="p-6">
            <p className={`${montserrat.className} text-gray-700 leading-relaxed`}>
              {message}
            </p>
          </div>
        </div>

        {/* Action Recommendation Card */}
        <div className="bg-gradient-to-br from-[#36D7B7]/10 to-[#36D7B7]/5 border border-[#36D7B7]/30 rounded-xl shadow-sm">
          <div className="px-5 py-4 flex items-center gap-2 border-b border-[#36D7B7]/30">
            <FiTarget className="text-lg text-[#36D7B7]" />
            <span className={`${montserrat.className} text-lg font-semibold text-gray-800`}>
              Rekomendasi
            </span>
          </div>
          <div className="p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-[#36D7B7] rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                <FiCheckCircle className="w-5 h-5 text-white" />
              </div>
              <p className={`${montserrat.className} text-gray-700 font-medium leading-relaxed`}>
                {action}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Summary Stats */}
      {progressSummary && (
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm p-6">
          <h3 className={`${montserrat.className} text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2`}>
            <FiTrendingUp className="w-5 h-5" />
            Ringkasan Progress
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {/* Total Tutorial */}
            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-lg p-4 border border-purple-200">
              <div className="flex items-center gap-2 text-purple-600 mb-2">
                <FiBookOpen className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Total Materi</span>
              </div>
              <p className={`${quicksand.className} text-2xl font-bold text-gray-900`}>
                {progressSummary.total_tutorial_accessed || 0}
              </p>
            </div>

            {/* Completion Rate */}
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-4 border border-green-200">
              <div className="flex items-center gap-2 text-green-600 mb-2">
                <FiCheckCircle className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Completion</span>
              </div>
              <p className={`${quicksand.className} text-2xl font-bold text-gray-900`}>
                {progressSummary.completion_rate?.toFixed(1) || 0}%
              </p>
            </div>

            {/* Avg Exam Score */}
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-4 border border-blue-200">
              <div className="flex items-center gap-2 text-blue-600 mb-2">
                <FiAward className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Avg Score</span>
              </div>
              <p className={`${quicksand.className} text-2xl font-bold text-gray-900`}>
                {progressSummary.avg_exam_score?.toFixed(1) || 0}
              </p>
            </div>

            {/* Study Time */}
            <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg p-4 border border-orange-200">
              <div className="flex items-center gap-2 text-orange-600 mb-2">
                <FiClock className="w-4 h-4" />
                <span className="text-xs font-semibold uppercase">Waktu Belajar</span>
              </div>
              <p className={`${quicksand.className} text-2xl font-bold text-gray-900`}>
                {progressSummary.avg_study_duration_hours?.toFixed(1) || 0}h
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Disclaimer */}
      {disclaimer && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <FiInfo className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              {disclaimer}
            </p>
          </div>
        </div>
      )}
    </section>
  );
}
