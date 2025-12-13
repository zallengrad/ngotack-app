"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import StatsCard from "@/components/StatsCard";
import ExplorePrompt from "@/components/ExplorePrompt";
import ProgressOverview from "@/components/ProgressOverview";
import { Quicksand, Montserrat } from "next/font/google";
import { useAuth } from "@/contexts/AuthContext";
import { getTrackingSummary } from "@/lib/tracking";
import { FiCheckCircle, FiClock, FiBookOpen } from "react-icons/fi";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const userName = user?.username || "User";
  const container = "max-w-[1400px]";
  const navLinks = [
    { href: "/dashboard/courses", label: "Course", active: false },
    { href: "/dashboard", label: "Dashboard", active: true },
  ];

  const [trackingData, setTrackingData] = useState(null);
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    fetchTrackingData();
  }, []);

  async function fetchTrackingData() {
    try {
      const result = await getTrackingSummary();
      if (result.success && result.data) {
        setTrackingData(result.data);
      }
    } catch (error) {
      console.error("Error fetching tracking data:", error);
    } finally {
      setLoadingStats(false);
    }
  }

  const handleLogout = () => {
    logout();
    window.location.href = "/auth/login";
  };

  const hasProgress = trackingData && (trackingData.completed > 0 || trackingData.inProgress > 0);

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header
        containerClassName={container}
        profileMenu={{ 
          menuItems: [{ 
            label: "Logout", 
            onClick: handleLogout 
          }] 
        }}
        rightContent={
          <nav className="flex items-center gap-3">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a
                  className={`px-6 py-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out ${
                    item.active ? "bg-white text-gray-900 font-semibold" : "text-gray-800"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
        }
      />

      <main className={`${container} mx-auto px-6 lg:px-10 py-12 flex-grow w-full`}>
        {/* Welcome banner */}
        <div className="bg-[#36D7B7] text-gray-900 rounded-xl px-6 py-6 sm:py-8 shadow-sm mb-8 w-full">
          <h1 className={`${quicksand.className} text-2xl sm:text-3xl font-bold text-gray-900`}>Selamat Datang {userName}!</h1>
          <p className="mt-2 text-base sm:text-lg text-gray-900">Semoga aktifitas belajar mu menyenangkan.</p>
        </div>

        {/* Stats Cards */}
        {loadingStats ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {[1, 2, 3].map((i) => (
              <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
                <div className="h-8 bg-gray-200 rounded w-1/3 mb-2"></div>
                <div className="h-3 bg-gray-200 rounded w-2/3"></div>
              </div>
            ))}
          </div>
        ) : trackingData ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <StatsCard
              icon={FiCheckCircle}
              title="Materi Selesai"
              value={trackingData.completed || 0}
              subtitle="Tutorial yang telah diselesaikan"
              color="bg-[#36D7B7]"
            />
            <StatsCard
              icon={FiBookOpen}
              title="Sedang Belajar"
              value={trackingData.inProgress || 0}
              subtitle="Tutorial yang sedang dipelajari"
              color="bg-[#FFA500]"
            />
            <StatsCard
              icon={FiClock}
              title="Total Waktu Belajar"
              value={`${trackingData.totalDurationHours?.toFixed(1) || 0} jam`}
              subtitle={`${trackingData.totalDurationSeconds || 0} detik`}
              color="bg-[#9333EA]"
            />
          </div>
        ) : null}

        <div className="text-center">{hasProgress ? <ProgressOverview userName={userName} /> : <ExplorePrompt userName={userName} />}</div>
      </main>

      <Footer containerClassName={container} />
    </div>
  );
}
