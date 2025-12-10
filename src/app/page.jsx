// Landing page for NGOTACK with specified typography and color palette.

import Link from "next/link";
import Image from "next/image";
import { Playfair_Display, Quicksand } from "next/font/google";
import Footer from "@/components/Footer";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });

const Navbar = () => {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 border-b border-gray-200 bg-white">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <Image src="/assets/logo.png" alt="NGOTACK Logo" width={120} height={40} className="h-12 w-auto object-contain" priority />
        </div>
        <nav className="space-x-3 flex items-center">
          <Link href="/auth/login" className={`${quicksand.className} px-7 py-2.5 border border-gray-200 text-gray-800 rounded-lg shadow-sm hover:shadow-md transition duration-150 ease-in-out`}>
            Login
          </Link>
          <Link href="/auth/register" className={`${quicksand.className} px-7 py-2.5 bg-[#36D7B7] text-black rounded-lg shadow-sm hover:shadow-md hover:brightness-95 transition duration-150 ease-in-out`}>
            Sign Up
          </Link>
        </nav>
      </div>
    </header>
  );
};

const HeroSection = () => {
  return (
    <main className="max-w-6xl mx-auto px-6 lg:px-10 py-16 md:py-20">
      <div className="grid md:grid-cols-2 gap-12 items-center">
        <div className="flex flex-col gap-6">
          <h1 className={`${playfair.className} text-4xl md:text-5xl font-bold text-gray-900 leading-tight`}>
            Improve Your <br />
            Study Habbits <br />
            with AI Insights
          </h1>
          <p className="text-base text-gray-700 leading-relaxed max-w-md">Ngotack helps students understand their learning patterns through intelligent tracking and analysis, powered by artificial intelligence.</p>
          <button className={`${quicksand.className} w-fit cursor-pointer px-6 py-3 bg-[#36D7B7] text-black font-semibold rounded-lg shadow-md hover:shadow-lg hover:brightness-95 transition duration-150 ease-in-out`}>Get Started !</button>
        </div>
        <div className="relative flex justify-center md:justify-end">
          <div className="w-full max-w-lg bg-white rounded-xl flex items-center justify-center  p-4">
            <Image src="/assets/hero.png" alt="Ilustrasi: Improve Your Study Habits" width={640} height={420} className="w-full h-auto object-contain rounded-lg" priority />
          </div>
        </div>
      </div>
    </main>
  );
};

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col bg-white text-gray-900">
      <Navbar />
      <div className="flex-grow flex items-center pt-24 md:pt-28">
        <HeroSection />
      </div>
      <Footer />
    </div>
  );
}
