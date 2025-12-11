"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Quicksand, Montserrat } from "next/font/google";
import { FiClock, FiMapPin, FiLayers } from "react-icons/fi";
import { getAllJourneys, getJourneyDetail } from "@/lib/journeys";
import { useAuth } from "@/contexts/AuthContext";

const quicksand = Quicksand({
  subsets: ["latin"],
  weight: ["600", "700"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "600"],
  display: "swap",
});

function CourseCard({ id, title, badge, description, duration, level, modules }) {
  return (
    <Link href={`/dashboard/courses/learning?course=${id}`} className="bg-[#9beccf] rounded-xl p-6 shadow-sm border border-[#7bd6b6] transform duration-150 ease-in-out hover:scale-[1.01] hover:shadow-md cursor-pointer block">
      <h3
        className={`${quicksand.className} text-xl font-semibold text-gray-900 mb-3`}
      >
        {title}
      </h3>

      <div
        className={`${montserrat.className} inline-flex items-center px-3 py-1 rounded-full bg-[#3bbf95] text-white text-xs font-semibold mb-4`}
      >
        {badge}
      </div>

      <p
        className={`${montserrat.className} text-sm text-gray-800 leading-relaxed mb-6 line-clamp-3`}
      >
        {description}
      </p>

      <div className="flex flex-wrap gap-6 text-sm text-gray-800">
        <div className="flex items-center gap-2">
          <FiClock />
          <span>{duration}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiMapPin />
          <span>{level}</span>
        </div>
        <div className="flex items-center gap-2">
          <FiLayers />
          <span>{modules}</span>
        </div>
      </div>
    </Link>
  );
}

function LoadingSkeleton() {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      {[1, 2, 3, 4].map((i) => (
        <div key={i} className="bg-gray-200 rounded-xl p-6 animate-pulse">
          <div className="h-6 bg-gray-300 rounded w-3/4 mb-3"></div>
          <div className="h-4 bg-gray-300 rounded w-1/4 mb-4"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-full mb-2"></div>
          <div className="h-4 bg-gray-300 rounded w-2/3 mb-6"></div>
          <div className="flex gap-6">
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
            <div className="h-4 bg-gray-300 rounded w-16"></div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const container = "max-w-[1400px]";

  const navLinks = [
    { href: "/dashboard/courses", label: "Course", active: true },
    { href: "/dashboard", label: "Dashboard", active: false },
  ];

  useEffect(() => {
    fetchCourses();
  }, []);

  async function fetchCourses() {
    setLoading(true);
    setError(null);

    try {
      // Fetch all journeys
      const result = await getAllJourneys();

      if (result.success) {
        console.log("Journeys data:", result.data);
        
        const coursesWithDetails = [];
        
        // Fetch details sequentially to avoid overwhelming the backend
        for (const journey of result.data) {
          let tutorialCount = 0;
          try {
            // Add a small delay between requests if needed
            const detailResult = await getJourneyDetail(journey.journey_id);
            if (detailResult.success && detailResult.data.tutorial) {
              tutorialCount = detailResult.data.tutorial.length;
            }
          } catch (err) {
            console.warn(`Failed to fetch details for journey ${journey.journey_id}`, err);
          }

          // Safe access to properties with defaults
          const difficulty = journey.difficulty || 'beginner';
          const duration = journey.duration_hours || 0;
          const title = journey.title || 'Untitled Course';
          const description = journey.description || 'No description available.';

          coursesWithDetails.push({
            id: journey.journey_id,
            title: title,
            badge: difficulty === 'beginner' ? 'Beginner' : 
                   difficulty === 'intermediate' ? 'Intermediate' : 'Advanced',
            description: description,
            duration: `${duration} Jam`,
            level: difficulty.charAt(0).toUpperCase() + difficulty.slice(1),
            modules: `${tutorialCount} Modul`,
          });
        }

        setCourses(coursesWithDetails);
      } else {
        setError(result.error || 'Failed to fetch courses');
      }
    } catch (err) {
      setError('An error occurred while fetching courses');
      console.error('Error:', err);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header
        containerClassName={container}
        profileMenu={{ menuItems: [{ label: "Logout", href: "/auth/login" }] }}
        rightContent={
          <nav className="flex items-center gap-3">
            {navLinks.map((item) => (
              <Link 
                key={item.href} 
                href={item.href}
                className={`px-6 py-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out ${
                  item.active
                    ? "bg-white text-gray-900 font-semibold"
                    : "text-gray-800"
                }`}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        }
      />

      <main
        className={`${container} mx-auto px-6 lg:px-10 py-12 flex-grow space-y-10`}
      >
        {/* Banner */}
        <div className="bg-[#36D7B7] text-gray-900 rounded-xl px-6 py-6 sm:py-8 shadow-sm">
          <h1
            className={`${quicksand.className} text-2xl sm:text-3xl font-semibold mb-2`}
          >
            Our Courses
          </h1>
          <p className={`${montserrat.className} text-base text-gray-900/90`}>
            Kamu bisa mulai belajar dan mencoba berbagai course kami!
          </p>
        </div>

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700">
            <p className="font-semibold">Error loading courses</p>
            <p className="text-sm">{error}</p>
            <button 
              onClick={fetchCourses}
              className="mt-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
            >
              Retry
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && <LoadingSkeleton />}

        {/* Courses Grid */}
        {!loading && !error && courses.length > 0 && (
          <div className="grid md:grid-cols-2 gap-6">
            {courses.map((course) => (
              <CourseCard key={course.id} {...course} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && !error && courses.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600">No courses available at the moment.</p>
          </div>
        )}
      </main>

      <Footer containerClassName={container} />
    </div>
  );
}
