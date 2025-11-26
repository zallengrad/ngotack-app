import Link from "next/link";
import Image from "next/image";
import { Quicksand, Montserrat } from "next/font/google";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

export default function ExplorePrompt({
  userName = "Pengguna",
  ctaHref = "/dashboard/courses",
  imageSrc = "/assets/first_dashboard.png",
  imageAlt = "Ilustrasi Dashboard",
}) {
  return (
    <div className="text-center">
      <h2 className={`${montserrat.className} text-2xl sm:text-3xl font-semibold mb-3`}>Hai {userName}, Siap mulai perjalanan belajar mu?</h2>
      <p className="text-base sm:text-lg text-gray-700 mb-8">Mulai belajar dengan pengalaman baru!</p>

      <Link href={ctaHref} legacyBehavior>
        <a className={`${quicksand.className} inline-block px-8 py-3 bg-[#0ba14f] text-white font-semibold rounded-sm shadow-sm hover:shadow-md transition duration-150 ease-in-out`}>
          Jelajahi Kelas
        </a>
      </Link>

      <div className="mt-14 flex justify-center">
        <div className="w-full max-w-xl flex items-center justify-center">
          <Image src={imageSrc} alt={imageAlt} width={540} height={360} className="w-full h-auto object-contain" priority />
        </div>
      </div>
    </div>
  );
}
