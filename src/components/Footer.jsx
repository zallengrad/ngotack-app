import Link from "next/link";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

export default function Footer({ className = "", containerClassName = "max-w-6xl" }) {
  return (
    <footer className={`mt-12 ${className}`}>
      <div className="border-t border-gray-300" />
      <div
        className={`${montserrat.className} ${containerClassName} mx-auto px-6 lg:px-10 py-4 flex flex-col md:flex-row justify-between items-center text-sm text-gray-700`}
      >
        <div className="flex items-center space-x-1 mb-2 md:mb-0">
          <span>@ NGOTACK</span>
          <span>|</span>
          <span>AI Learning Insight</span>
        </div>
        <nav className="space-x-6">
          <Link href="/terms" className="hover:text-gray-900 transition duration-150">
            Terms
          </Link>
          <Link href="/privacy" className="hover:text-gray-900 transition duration-150">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
