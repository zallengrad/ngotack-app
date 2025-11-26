import Link from "next/link";
import Image from "next/image";
import Footer from "@/components/Footer";
import Header from "@/components/Header";
import ExplorePrompt from "@/components/ExplorePrompt";
import ProgressOverview from "@/components/ProgressOverview";
import { Quicksand, Montserrat } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

export default function DashboardPage() {
  const userName = "Udin";
  const container = "max-w-[1400px]";
  const navLinks = [
    { href: "/dashboard/courses", label: "Course", active: false },
    { href: "/dashboard", label: "Dashboard", active: true },
  ];
  const hasProgress = true; // ganti dengan kondisi nyata saat progress tersedia

  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Header
        containerClassName={container}
        profileMenu={{ menuItems: [{ label: "Logout", href: "/auth/login" }] }}
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
        <div className="bg-[#36D7B7] text-gray-900 rounded-xl px-6 py-6 sm:py-8 shadow-sm mb-12 w-full">
          <h1 className={`${quicksand.className} text-2xl sm:text-3xl font-bold text-gray-900`}>Selamat Datang {userName}!</h1>
          <p className="mt-2 text-base sm:text-lg text-gray-900">Semoga aktifitas belajar mu menyenangkan.</p>
        </div>

        <div className="text-center">{hasProgress ? <ProgressOverview userName={userName} /> : <ExplorePrompt userName={userName} />}</div>
      </main>

      <Footer containerClassName={container} />
    </div>
  );
}
