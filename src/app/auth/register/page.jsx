"use client";

import Link from "next/link";
import Image from "next/image";
import { Playfair_Display, Quicksand, Montserrat } from "next/font/google";
import Footer from "@/components/Footer";
import { useState } from "react";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { validatePassword } from "@/lib/auth";

const playfair = Playfair_Display({ subsets: ["latin"], weight: ["600", "700", "800"], display: "swap" });
const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

export default function SignupPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { register } = useAuth();
  const router = useRouter();

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Validation
    if (!username || !password || !confirmPassword) {
      setError("Please fill in all fields");
      setLoading(false);
      return;
    }

    // Check password match
    if (password !== confirmPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    // Validate password requirements
    const validation = validatePassword(password);
    if (!validation.isValid) {
      const errors = [];
      if (validation.errors.length) errors.push("at least 8 characters");
      if (validation.errors.uppercase) errors.push("uppercase letter");
      if (validation.errors.lowercase) errors.push("lowercase letter");
      if (validation.errors.number) errors.push("number");
      
      setError(`Password must contain: ${errors.join(", ")}`);
      setLoading(false);
      return;
    }

    // Call register service
    const result = await register(username, password);
    
    if (result.success) {
      // Redirect to login on success
      router.push("/auth/login?registered=true");
    } else {
      setError(result.error || "Registration failed. Please try again.");
    }
    
    setLoading(false);
  };

  return (
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
          {/* Left copy + image */}
          <div className="space-y-6 h-full flex flex-col">
            <div>
              <p className={`${montserrat.className} text-xl text-gray-800`}>Hello Einstein,</p>
              <h1 className={`${playfair.className} text-4xl font-bold text-black mt-1`}>welcome</h1>
              <p className="mt-3 text-sm text-gray-700 leading-relaxed">Keep going, you&apos;re improving every day.</p>
            </div>
            <div className=" flex-1 flex items-center">
              <Image src="/assets/hero.png" alt="Ilustrasi: Improve Your Study Habits" width={520} height={340} className="w-3/4 h-auto object-contain rounded-lg" priority />
            </div>
          </div>

          {/* Form card */}
          <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-8 h-full flex flex-col">
            <h2 className={`${montserrat.className} text-xl md:text-2xl font-semibold text-center text-gray-900`}>Signup to your Account</h2>
            <p className="text-sm text-center text-gray-600 mt-1 mb-6">Welcome back kidz, ready to start upgrade your skill?</p>

            {/* Error Message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 flex-1">
              {/* Username */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800">Username</label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36D7B7]"
                  placeholder="Username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={loading}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800">Password</label>
                <div className="relative">
                  <input 
                    type={showPassword ? "text" : "password"} 
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36D7B7]" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    disabled={loading}
                  />
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

              {/* Confirm Password */}
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-800">Confirm Password</label>
                <div className="relative">
                  <input 
                    type={showConfirmPassword ? "text" : "password"} 
                    className="w-full p-3 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#36D7B7]" 
                    placeholder="Confirm Password" 
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    disabled={loading}
                  />
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

              {/* Submit Button */}
              <div className="pt-2">
                <button 
                  type="submit" 
                  className={`${quicksand.className} w-full py-3 bg-[#36D7B7] text-black font-semibold rounded-lg shadow-sm hover:shadow-md hover:brightness-95 transition disabled:opacity-50 disabled:cursor-not-allowed`}
                  disabled={loading}
                >
                  {loading ? "Creating Account..." : "Sign Up"}
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
