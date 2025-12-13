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
import { getTrackingSummary, getUserActivities } from "@/lib/tracking";
import { getJourneyDetail } from "@/lib/journeys";
import { FiCheckCircle, FiClock, FiBookOpen } from "react-icons/fi";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

// Helper function to format relative time
function getRelativeTime(timestamp) {
  const now = new Date();
  const past = new Date(timestamp);
  const diffMs = now - past;
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) return `${diffMins} menit lalu`;
  if (diffHours < 24) return `${diffHours} jam lalu`;
  return `${diffDays} hari lalu`;
}

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const userName = user?.username || "User";
  const container = "max-w-[1400px]";
  const navLinks = [
    { href: "/dashboard/courses", label: "Course", active: false },
    { href: "/dashboard", label: "Dashboard", active: true },
  ];

  const [trackingData, setTrackingData] = useState(null);
  const [activities, setActivities] = useState([]);
  const [completedJourneys, setCompletedJourneys] = useState([]);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingProgress, setLoadingProgress] = useState(true);

  useEffect(() => {
    fetchTrackingData();
    fetchActivitiesData();
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

  async function fetchActivitiesData() {
    try {
      // Fetch recent activities
      const activitiesResult = await getUserActivities(5, 0);
      
      if (activitiesResult.success && activitiesResult.data?.activities) {
        const rawActivities = activitiesResult.data.activities;
        
        // Transform activities to match ProgressOverview format
        const transformedActivities = rawActivities.map(activity => ({
          status: activity.action === 'complete' ? 'Lulus' : 'Sedang dipelajari',
          title: activity.tutorial_title || 'Tutorial',
          timeAgo: getRelativeTime(activity.timestamp),
          action: activity.action === 'complete' ? 'Selesai' : 'Belajar'
        }));
        
        setActivities(transformedActivities);

        // Get unique journey IDs from completed tutorials
        const completedTutorials = rawActivities.filter(a => a.action === 'complete');
        const journeyIds = [...new Set(completedTutorials.map(a => a.journey_id))];
        
        // Fetch journey details for completed journeys
        const journeyPromises = journeyIds.slice(0, 4).map(id => getJourneyDetail(id));
        const journeyResults = await Promise.all(journeyPromises);
        
        const transformedJourneys = journeyResults
          .filter(result => result.success && result.data)
          .map(result => {
            const journey = result.data;
            const tutorialCount = journey.tutorial?.length || 0;
            
            return {
              title: journey.title || 'Journey',
              duration: `${journey.duration_minutes || 0} menit`,
              level: journey.difficulty || 'Beginner',
              modules: `${tutorialCount} Tutorial`,
              badge: journey.category || 'Learning'
            };
          });
        
        setCompletedJourneys(transformedJourneys);
      }
    } catch (error) {
      console.error("Error fetching activities:", error);
    } finally {
      setLoadingProgress(false);
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

        {/* Progress Overview or Explore Prompt */}
        <div className="text-center">
          {loadingProgress ? (
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4 mx-auto"></div>
                <div className="h-8 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </div>
          ) : hasProgress ? (
            <ProgressOverview 
              userName={userName}
              activities={activities.length > 0 ? activities : undefined}
              completedClasses={completedJourneys.length > 0 ? completedJourneys : undefined}
            />
          ) : (
            <ExplorePrompt userName={userName} />
          )}
        </div>
      </main>

      <Footer containerClassName={container} />
    </div>
  );
}
