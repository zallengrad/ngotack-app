import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-screen flex bg-white">
      {/* LEFT: FORM */}
      <div className="flex-1 flex items-center justify-center bg-gray-50 px-6">
        <div className="w-full max-w-md bg-white border border-gray-200 p-8 rounded-2xl shadow-sm">
          {/* Logo + title (klik → landing page) */}
          <Link href="/" className="flex items-center gap-2 mb-6">
            <div className="w-8 h-8 rounded-md bg-indigo-600 flex items-center justify-center text-white">
              <span className="text-sm">📘</span>
            </div>
            <span className="font-semibold text-lg text-indigo-700">Ngotack App</span>
          </Link>

          <h2 className="text-xl font-bold mb-1">Login to your Account</h2>
          <p className="text-sm text-gray-500 mb-6">Welcome back, ready to upgrade your coding skill?</p>

          <form className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">Email</label>
              <input type="email" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your email" />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">Password</label>
              <input type="password" className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter your password" />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2">
                <input type="checkbox" className="rounded" />
                <span>Remember me</span>
              </label>
              <button type="button" className="text-indigo-600">
                Forgot Password?
              </button>
            </div>

            <button type="submit" className="w-full py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition">
              Log in
            </button>
          </form>

          <p className="text-center text-sm mt-4">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-indigo-600 font-semibold">
              Create Account
            </Link>
          </p>
        </div>
      </div>

      {/* RIGHT: BLUE PANEL */}
      <div className="hidden md:flex flex-1 bg-indigo-600 text-white items-center justify-center px-10">
        <div className="max-w-md">
          <Link href="/" className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-white rounded-md flex items-center justify-center">
              <span className="text-2xl text-indigo-600">📘</span>
            </div>
            <span className="text-2xl font-semibold">Ngotack App</span>
          </Link>

          <p className="text-3xl font-light">
            Hello Coders,
            <br />
            <span className="font-bold">welcome</span>
          </p>
          <p className="mt-4 text-sm leading-relaxed text-indigo-100">Tujuan belajar bukanlah untuk menjadi lebih baik dari orang lain. Tujuannya adalah untuk menjadi lebih baik dari diri kamu yang kemarin.</p>
        </div>
      </div>
    </main>
  );
}
