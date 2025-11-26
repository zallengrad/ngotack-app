"use client";

import Link from "next/link";
import Image from "next/image";
// Asumsi font sudah di-import di project Anda (seperti di file Login sebelumnya)
import { Playfair_Display, Quicksand, Montserrat } from "next/font/google";
import Footer from "@/components/Footer";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa"; // Icons untuk toggle password

// Definisi font harus sama dengan file LoginPage
const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

export default function SignupPage() {
  // State untuk mengontrol visibilitas password
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Fungsi toggle untuk Password utama
  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // Fungsi toggle untuk Confirm Password
  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  return (
    // Struktur luar sama persis dengan halaman Login
    <main className="min-h-screen bg-[#f7f9fb] text-gray-900">
      <div className="max-w-6xl mx-auto px-6 lg:px-10 py-10">
        {/* Header / Logo */}
        <div className="flex items-center mb-10">
          <Link href="/" className="flex items-center space-x-2">
            <Image src="/assets/logo.png" alt="NGOTACK Logo" width={130} height={40} className="h-12 w-auto object-contain" priority />
          </Link>
        </div>

        {/* Content */}
        <div className="grid md:grid-cols-2 gap-10 items-stretch">
          {/* Left copy + image (Bagian ini sama) */}
          <div className="space-y-6 h-full flex flex-col">
            <div>
              {/* Copy disesuaikan sedikit agar lebih sesuai dengan konteks umum sign up */}
              <p className={`${montserrat.className} text-xl text-gray-800`}>Hello Einstein,</p>
              <h1 className={`${playfair.className} text-4xl font-bold text-black mt-1`}>welcome</h1>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">Keep going, you&apos;re improving every day.</p>
            </div>
            <div className=" flex-1 flex items-center">
              {/* Image di kiri (asumsi menggunakan hero.png yang sama) */}
              <Image src="/assets/hero.png" alt="Ilustrasi: Improve Your Study Habits" width={520} height={340} className="w-3/4 h-auto object-contain rounded-lg" priority />
            </div>
          </div>

          {/* Form card (Bagian ini disesuaikan) */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 h-full flex flex-col">
            <h2 className={`${montserrat.className} text-xl md:text-2xl font-semibold text-center text-gray-900`}>Signup to your Account</h2>
            <p className="text-sm text-center text-gray-600 mt-1 mb-6">Welcome back kidz, ready to start upgrade your skill?</p>

            <form className="space-y-4 flex-1">
              {/* 1. Kolom Username (Perbedaan dari Login) */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800">Username</label>
                <input
                  type="text" // Type text untuk username
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36D7B7]"
                  placeholder="Username"
                />
              </div>

              {/* 2. Kolom Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800">Password</label>
                <div className="relative">
                  <input type={showPassword ? "text" : "password"} className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36D7B7]" placeholder="Password" />
                  <button
                    type="button"
                    onClick={togglePasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <FaRegEyeSlash className="h-5 w-5" /> : <FaRegEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* 3. Kolom Confirm Password (Perbedaan dari Login) */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800">Confirm Password</label>
                <div className="relative">
                  <input type={showConfirmPassword ? "text" : "password"} className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36D7B7]" placeholder="Confirm Password" />
                  <button
                    type="button"
                    onClick={toggleConfirmPasswordVisibility}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-gray-700 cursor-pointer"
                    aria-label={showConfirmPassword ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirmPassword ? <FaRegEyeSlash className="h-5 w-5" /> : <FaRegEye className="h-5 w-5" />}
                  </button>
                </div>
              </div>

              {/* Tombol Sign Up */}
              {/* Tombol Sign Up tidak punya Remember Me/Forgot Password */}
              <div className="pt-2">
                <button type="submit" className={`${quicksand.className} w-full py-3 bg-[#36D7B7] text-black font-semibold rounded-lg shadow-sm hover:shadow-md hover:brightness-95 transition`}>
                  Sign Up
                </button>
              </div>
            </form>

            {/* Link Login */}
            <p className="text-center text-sm mt-6 text-gray-700">
              Already have account?{" "}
              <Link href="/auth/login" className="text-[#36D7B7] font-semibold hover:underline">
                Login now
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </main>
  );
}
