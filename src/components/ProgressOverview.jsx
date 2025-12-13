import { Quicksand, Montserrat } from "next/font/google";
import { FiBookOpen, FiBookmark, FiCheckCircle, FiClock, FiLayers, FiMapPin } from "react-icons/fi";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const defaultInsightText =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";

const defaultActivities = [
  { status: "Sedang dipelajari", title: "Menjadi Front End Developer", timeAgo: "20 Jam lalu", action: "Belajar" },
  { status: "Sedang dipelajari", title: "Menjadi Front End Developer", timeAgo: "20 Jam lalu", action: "Belajar" },
  { status: "Lulus", title: "Menjadi Front End Developer", timeAgo: "20 Jam lalu", action: "Belajar" },
];

const defaultCompleted = [
  { title: "Menjadi Front End Developer", duration: "2 Jam", level: "Beginner", modules: "10 Module", badge: "Web Developer" },
  { title: "Menjadi Front End Developer", duration: "2 Jam", level: "Beginner", modules: "10 Module", badge: "Web Developer" },
];

function ActivityCard({ status, title, timeAgo, action }) {
  const isCompleted = status === "Lulus";
  const bgColor = isCompleted ? "bg-[#66ddb3]" : "bg-[#9beccf]";
  const borderColor = isCompleted ? "border-[#56c8a0]" : "border-[#7fd4b7]";
  
  return (
    <div className={`${bgColor} ${borderColor} rounded-lg p-5 border shadow-sm hover:shadow-md transition-shadow duration-200`}>
      {/* Journey title */}
      <h4 className="text-base font-bold text-gray-900 mb-2 leading-snug">
        {title}
      </h4>
      
      {/* Timestamp */}
      <p className="text-xs text-gray-800 flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
        {timeAgo}
      </p>
    </div>
  );
}

function CompletedCard({ title, duration, level, modules, badge }) {
  return (
    <div className="bg-[#9beccf] rounded-xl p-6 shadow-sm border border-[#7fd4b7]">
      <div className="flex items-center gap-2 text-sm text-gray-900 font-semibold mb-4">
        <FiCheckCircle className="text-green-700" />
        <span>Lulus</span>
      </div>
      <h3 className={`${quicksand.className} text-xl font-semibold text-gray-900 mb-2`}>{title}</h3>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3bbf95] text-white text-xs font-semibold mb-4">{badge}</div>
      <div className="flex flex-wrap gap-6 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <FiLayers />
          <span>{modules}</span>
        </div>
      </div>
    </div>
  );
}

export default function ProgressOverview({
  userName = "Udin",
  persona = "Reflective Learner",
  insightText = defaultInsightText,
  activities = defaultActivities,
  completedClasses = defaultCompleted,
}) {
  return (
    <section className="space-y-10">
      {/* Top row: AI Insights + Aktivitas */}
      <div className="grid md:grid-cols-2 gap-6">
        {/* AI Insights */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm">
          <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-200">
            <FiBookOpen className="text-lg text-gray-800" />
            <span className={`${montserrat.className} text-lg font-semibold text-gray-800`}>AI Insights</span>
          </div>
          <div className="p-6 space-y-4 text-gray-800">
            <p className={`${montserrat.className} text-sm`}>Selamat, kamu masuk ke golongan</p>
            <div className="inline-flex items-center px-4 py-2 border border-[#3bbf95] text-[#0e9f7a] rounded-full font-semibold text-sm">{persona}</div>
            <p className="text-sm leading-relaxed">{insightText}</p>
          </div>
        </div>

        {/* Aktivitas Belajar */}
        <div className="bg-white border border-gray-300 rounded-xl shadow-sm">
          <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-200">
            <FiBookmark className="text-lg text-gray-800" />
            <span className={`${montserrat.className} text-lg font-semibold text-gray-800`}>Aktivitas Belajar</span>
          </div>
          <div className="p-4 space-y-3 max-h-[400px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
            {activities.map((item, idx) => (
              <ActivityCard key={`${item.title}-${idx}`} {...item} />
            ))}
          </div>
        </div>
      </div>

      {/* Completed classes */}
      <div className="bg-white border border-gray-300 rounded-xl shadow-sm">
        <div className="px-5 py-4 flex items-center gap-2 border-b border-gray-200">
          <FiBookOpen className="text-lg text-gray-800" />
          <span className={`${montserrat.className} text-lg font-semibold text-gray-800`}>Kelas Selesai</span>
        </div>
        <div className="p-6 grid md:grid-cols-2 gap-4 max-h-[500px] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100">
          {completedClasses.map((item, idx) => (
            <CompletedCard key={`${item.title}-${idx}`} {...item} />
          ))}
        </div>
      </div>
    </section>
  );
}
