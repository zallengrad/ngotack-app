import { Quicksand, Montserrat } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

export default function StatsCard({ icon: Icon, title, value, subtitle, color = "bg-[#36D7B7]" }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className={`${montserrat.className} text-sm text-gray-600 mb-1`}>{title}</p>
          <h3 className={`${quicksand.className} text-3xl font-bold text-gray-900 mb-1`}>
            {value}
          </h3>
          {subtitle && (
            <p className={`${montserrat.className} text-xs text-gray-500`}>{subtitle}</p>
          )}
        </div>
        <div className={`${color} p-3 rounded-lg`}>
          <Icon className="text-white text-2xl" />
        </div>
      </div>
    </div>
  );
}
