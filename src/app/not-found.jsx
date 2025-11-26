import Image from "next/image";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], weight: ["600"], display: "swap" });

export default function NotFound() {
  const container = "max-w-[1400px]";

  return (
    <div className="min-h-screen flex flex-col bg-[#f7f9fb] text-gray-900">
      <Header containerClassName={container} />

      <main className={`${container} mx-auto px-6 lg:px-10 py-16 flex-grow flex flex-col items-center text-center`}>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-4 sm:p-6">
          <Image src="/assets/404.png" alt="404 illustration" width={640} height={360} className="w-full h-auto object-contain" priority />
        </div>

        <h1 className={`${montserrat.className} text-2xl sm:text-3xl font-semibold mt-10 mb-3`}>Waduh, gak ketemu nih...</h1>
        <p className="text-sm sm:text-base text-gray-700">Nampaknya apa yang kamu cari tidak tersedia.</p>
      </main>

      <Footer containerClassName={container} />
    </div>
  );
}
