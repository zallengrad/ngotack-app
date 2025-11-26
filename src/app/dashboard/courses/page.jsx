import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Quicksand, Montserrat } from "next/font/google";
import { FiClock, FiMapPin, FiLayers } from "react-icons/fi";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const courses = Array.from({ length: 6 }).map(() => ({
  title: "Menjadi Front End Developer",
  badge: "Web Developer",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  duration: "2 Jam",
  level: "Beginner",
  modules: "10 Module",
}));

function CourseCard({ title, badge, description, duration, level, modules }) {
  return (
    <div className="bg-[#9beccf] rounded-xl p-6 shadow-sm border border-[#7fd4b7] transition-transform duration-150 ease-in-out hover:scale-[1.01] cursor-pointer">
      <h3 className={`${quicksand.className} text-xl font-semibold text-gray-900 mb-3`}>{title}</h3>
      <div className="inline-flex items-center px-3 py-1 rounded-full bg-[#3bbf95] text-white text-xs font-semibold mb-4">{badge}</div>
      <p className="text-sm text-gray-800 leading-relaxed mb-6">{description}</p>
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
    </div>
  );
}

export default function CoursesPage() {
  const container = "max-w-[1400px]";

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header
        containerClassName={container}
        profileMenu={{ menuItems: [{ label: "Logout", href: "/auth/login" }] }}
        rightContent={
          <nav className="flex items-center gap-3">
            <Link href="/dashboard/courses" legacyBehavior>
              <a className="px-6 py-2 border border-gray-200 bg-white text-gray-900 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out font-semibold">
                Course
              </a>
            </Link>
            <Link href="/dashboard" legacyBehavior>
              <a className="px-6 py-2 border border-gray-200 text-gray-800 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out">
                Dashboard
              </a>
            </Link>
          </nav>
        }
      />

      <main className={`${container} mx-auto px-6 lg:px-10 py-12 flex-grow space-y-10`}>
        {/* Banner */}
        <div className="bg-[#36D7B7] text-gray-900 rounded-xl px-6 py-6 sm:py-8 shadow-sm">
          <h1 className={`${quicksand.className} text-2xl sm:text-3xl font-semibold mb-2`}>Our Courses</h1>
          <p className={`${montserrat.className} text-base sm:text-lg`}>Kamu bisa mulai belajar dan mencoba berbagai course kami!</p>
        </div>

        {/* Courses grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course, idx) => (
            <CourseCard key={`${course.title}-${idx}`} {...course} />
          ))}
        </div>
      </main>

      <Footer containerClassName={container} />
    </div>
  );
}
