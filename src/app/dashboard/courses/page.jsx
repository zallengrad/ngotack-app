import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Quicksand, Montserrat } from "next/font/google";
import { FiClock, FiMapPin, FiLayers } from "react-icons/fi";
import { COURSES } from "@/config/courses";

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

// data course: ambil dari COURSES, tapi bentuknya mirip file zip awal
const courses = COURSES.map((course) => ({
  id: course.id,
  title: course.title,
  badge: "Web Developer",
  description:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.",
  duration: "2 Jam",
  level: "Beginner",
  modules: "10 Modul",
}));

function CourseCard({ id, title, badge, description, duration, level, modules }) {
  return (
    <Link href={`/dashboard/courses/learning?course=${id}`} legacyBehavior>
      <a className="bg-[#9beccf] rounded-xl p-6 shadow-sm border border-[#7bd6b6] transform duration-150 ease-in-out hover:scale-[1.01] hover:shadow-md cursor-pointer">
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
          className={`${montserrat.className} text-sm text-gray-800 leading-relaxed mb-6`}
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
      </a>
    </Link>
  );
}

export default function CoursesPage() {
  const container = "max-w-[1400px]";

  // navLinks disamain gaya-nya dengan dashboard/page.jsx
  const navLinks = [
    { href: "/dashboard/courses", label: "Course", active: true },
    { href: "/dashboard", label: "Dashboard", active: false },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      {/* HEADER sama persis pattern-nya dengan dashboard */}
      <Header
        containerClassName={container}
        profileMenu={{ menuItems: [{ label: "Logout", href: "/auth/login" }] }}
        rightContent={
          <nav className="flex items-center gap-3">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href} legacyBehavior>
                <a
                  className={`px-6 py-2 border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out ${
                    item.active
                      ? "bg-white text-gray-900 font-semibold"
                      : "text-gray-800"
                  }`}
                >
                  {item.label}
                </a>
              </Link>
            ))}
          </nav>
        }
      />

      {/* MAIN */}
      <main
        className={`${container} mx-auto px-6 lg:px-10 py-12 flex-grow space-y-10`}
      >
        {/* Banner hijau Our Courses */}
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

        {/* Grid course */}
        <div className="grid md:grid-cols-2 gap-6">
          {courses.map((course) => (
            <CourseCard key={course.id} {...course} />
          ))}
        </div>
      </main>

      {/* FOOTER */}
      <Footer containerClassName={container} />
    </div>
  );
}
