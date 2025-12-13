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
      console.log('📊 Tracking Summary Result:', result);
      
      if (result.success && result.data) {
        console.log('✅ Tracking Data:', result.data);
        setTrackingData(result.data);
      } else {
        console.warn('⚠️ No tracking data or failed:', result);
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
      console.log('📋 Activities Result:', activitiesResult);
      
      if (activitiesResult.success && activitiesResult.data?.activities) {
        const rawActivities = activitiesResult.data.activities;
        console.log('📝 Raw Activities:', rawActivities);
        
        // Group by journey_id to get unique journeys
        const uniqueJourneyMap = new Map();
        
        rawActivities.forEach(activity => {
          const journeyId = activity.journey_id;
          // Keep the most recent activity for each journey
          if (!uniqueJourneyMap.has(journeyId)) {
            uniqueJourneyMap.set(journeyId, activity);
          } else {
            const existing = uniqueJourneyMap.get(journeyId);
            const existingDate = new Date(existing.last_viewed_at || existing.created_at);
            const currentDate = new Date(activity.last_viewed_at || activity.created_at);
            
            // Keep the more recent one
            if (currentDate > existingDate) {
              uniqueJourneyMap.set(journeyId, activity);
            }
          }
        });
        
        // Convert map to array and transform
        const uniqueActivities = Array.from(uniqueJourneyMap.values());
        
        const transformedActivities = uniqueActivities.map(activity => ({
          status: activity.is_completed ? 'Lulus' : 'Sedang dipelajari',
          title: activity.journeys?.title || activity.tutorial?.title || 'Tutorial',
          timeAgo: getRelativeTime(activity.last_viewed_at || activity.created_at),
          action: activity.is_completed ? 'Selesai' : 'Belajar'
        }));
        
        console.log('✨ Transformed Activities (unique):', transformedActivities);
        setActivities(transformedActivities);

        // Get unique journey IDs from all activities (not just completed)
        const journeyIds = [...new Set(rawActivities.map(a => a.journey_id).filter(Boolean))];
        
        console.log('🎯 Journey IDs to fetch:', journeyIds);
        
        if (journeyIds.length > 0) {
          // Fetch journey details for all journeys
          const journeyPromises = journeyIds.slice(0, 10).map(id => getJourneyDetail(id));
          const journeyResults = await Promise.all(journeyPromises);
          
          // Count completed tutorials per journey
          const completedTutorialsPerJourney = {};
          rawActivities.forEach(activity => {
            if (activity.is_completed) {
              const journeyId = activity.journey_id;
              if (!completedTutorialsPerJourney[journeyId]) {
                completedTutorialsPerJourney[journeyId] = new Set();
              }
              completedTutorialsPerJourney[journeyId].add(activity.tutorial_id);
            }
          });
          
          console.log('📊 Completed tutorials per journey:', completedTutorialsPerJourney);
          
          // Filter only journeys where ALL tutorials are completed
          const transformedJourneys = journeyResults
            .filter(result => result.success && result.data)
            .filter(result => {
              const journey = result.data;
              const journeyId = journey.journey_id;
              const totalTutorials = journey.tutorial?.length || 0;
              const completedTutorials = completedTutorialsPerJourney[journeyId]?.size || 0;
              
              console.log(`🎯 Journey "${journey.title}": ${completedTutorials}/${totalTutorials} tutorials completed`);
              
              // Only include if ALL tutorials are completed
              return totalTutorials > 0 && completedTutorials === totalTutorials;
            })
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
          
          console.log('🎓 Fully Completed Journeys:', transformedJourneys);
          setCompletedJourneys(transformedJourneys);
        }
      } else {
        console.warn('⚠️ No activities data');
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

  // Show ProgressOverview if:
  // 1. Tracking data shows completed or in-progress tutorials, OR
  // 2. We have activities data, OR
  // 3. We have completed journeys data
  const hasProgress = (trackingData && (trackingData.completed > 0 || trackingData.inProgress > 0)) ||
                      activities.length > 0 ||
                      completedJourneys.length > 0;
  
  // Debug logging
  console.log('🔍 Dashboard Debug:', {
    trackingData,
    hasProgress,
    activitiesCount: activities.length,
    completedJourneysCount: completedJourneys.length,
    loadingProgress,
    loadingStats,
    condition1: trackingData && (trackingData.completed > 0 || trackingData.inProgress > 0),
    condition2: activities.length > 0,
    condition3: completedJourneys.length > 0
  });

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
