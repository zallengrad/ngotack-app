import Link from "next/link";

export default function Home() {
  return (
    <main className="min-h-screen text-gray-900 bg-white">
      {/* ================= HERO SECTION ================= */}
      <section className="w-full min-h-screen px-6 bg-gradient-to-r from-indigo-500 to-purple-500 text-white flex items-center">
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-center">
          <div>
            {/* Logo kecil di hero */}
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-9 h-9 rounded-md bg-white flex items-center justify-center">
                <span className="text-xl">📘</span>
              </div>
              <span className="font-semibold text-lg">Ngotack App</span>
            </Link>

            <h1 className="text-5xl font-bold leading-tight mb-6">
              Belajar Coding Lebih Seru, Lebih Terstruktur, <br />
              <span className="text-yellow-300">Lebih Ngotack!</span>
            </h1>

            <p className="text-lg opacity-90 mb-8">Platform belajar coding yang fun, lengkap, dan ramah pemula. Pelajari berbagai roadmap dari frontend, backend, fullstack, hingga machine learning engineer!</p>

            <div className="flex gap-4">
              {/* Get Started langsung ke REGISTER */}
              <Link href="/register" className="px-7 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-lg hover:bg-yellow-300 transition">
                Get Started
              </Link>

              {/* Login ke halaman LOGIN */}
              <Link href="/login" className="px-7 py-3 border border-white font-semibold rounded-lg hover:bg-white hover:text-indigo-600 transition">
                Login
              </Link>
            </div>
          </div>

          {/* Kotak icon buku */}
          <div className="flex justify-center">
            <div className="w-64 h-64 bg-white/20 rounded-3xl backdrop-blur-md flex items-center justify-center">
              <span className="text-6xl">📘</span>
            </div>
          </div>
        </div>
      </section>

      {/* ================= POPULAR COURSES ================= */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold">Popular Roadmaps</h2>
          <p className="text-gray-600 mt-2">Pilih jalur belajar yang kamu mau</p>
        </div>

        <div className="max-w-6xl mx-auto grid sm:grid-cols-2 md:grid-cols-3 gap-6">
          {["Frontend Development", "Backend Development", "Fullstack Web Developer", "React Developer", "Android Developer", "Machine Learning Engineer"].map((course) => (
            <div key={course} className="p-6 bg-white rounded-xl shadow hover:shadow-md transition border border-gray-200">
              <div className="w-14 h-14 bg-indigo-100 text-indigo-600 rounded-xl flex items-center justify-center mb-4 font-semibold">⚡</div>
              <h3 className="text-lg font-bold">{course}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= FEATURES ================= */}
      <section className="py-20 px-6">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold">Apa yang akan kamu dapat?</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              title: "Roadmap Step-by-step",
              desc: "Belajar coding secara runtut dari dasar hingga expert.",
            },
            {
              title: "Materi Berbasis Project",
              desc: "Bangun portfolio nyata untuk dunia kerja.",
            },
            {
              title: "Komunitas Supportive",
              desc: "Diskusi, mentoring, dan networking dengan sesama coder.",
            },
          ].map((f) => (
            <div key={f.title} className="p-6 bg-gray-50 rounded-xl border border-gray-200 hover:shadow transition">
              <div className="text-3xl mb-3">💡</div>
              <h3 className="text-xl font-bold mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= STEPS ================= */}
      <section className="py-20 px-6 bg-indigo-50">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold">Mulai belajar dalam 3 langkah</h2>
        </div>

        <div className="max-w-4xl mx-auto grid md:grid-cols-3 gap-10">
          {[
            { number: "01", title: "Pilih Roadmap" },
            { number: "02", title: "Ikuti Materi & Latihan" },
            { number: "03", title: "Bangun Portofolio" },
          ].map((step) => (
            <div key={step.number} className="text-center">
              <div className="text-5xl font-extrabold text-indigo-500">{step.number}</div>
              <h3 className="mt-4 text-xl font-bold">{step.title}</h3>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CTA ================= */}
      <section className="py-20 px-6">
        <div className="max-w-4xl mx-auto text-center p-10 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-2xl text-white shadow-lg">
          <h2 className="text-3xl font-bold mb-4">Coba Gratis 7 Hari</h2>
          <p className="mb-8 opacity-90">Akses semua roadmap dan materi premium tanpa batas!</p>
          <Link href="/register" className="inline-block px-8 py-3 bg-yellow-400 text-gray-900 font-semibold rounded-xl hover:bg-yellow-300 transition">
            Mulai Sekarang
          </Link>
        </div>
      </section>

      {/* ================= TESTIMONIALS ================= */}
      <section className="py-20 px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto text-center mb-14">
          <h2 className="text-3xl font-bold">Kata Mereka</h2>
        </div>

        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          {[
            {
              name: "Ahmad",
              text: "Belajar coding jadi fun banget. Roadmap-nya jelas dan mudah diikuti!",
            },
            {
              name: "Dewi",
              text: "Suka banget sama materi berbasis project. Portofolio-ku jadi kuat!",
            },
            {
              name: "Rizky",
              text: "Komunitasnya aktif dan supportive. Cocok buat pemula.",
            },
          ].map((t) => (
            <div key={t.name} className="p-6 bg-white rounded-xl border border-gray-200 shadow-sm">
              <div className="text-4xl mb-4">💬</div>
              <p className="text-gray-700 mb-4">"{t.text}"</p>
              <p className="font-bold">{t.name}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ================= CONTACT US ================= */}
      <section className="py-20 px-6">
        <div className="max-w-xl mx-auto text-center mb-10">
          <h2 className="text-3xl font-bold">Contact Us</h2>
        </div>

        <form className="max-w-xl mx-auto grid gap-4">
          <input type="text" placeholder="Nama" className="p-3 border rounded-lg w-full" />
          <input type="email" placeholder="Email" className="p-3 border rounded-lg w-full" />
          <textarea placeholder="Pesan" className="p-3 border rounded-lg w-full h-32" />
          <button className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition">Kirim</button>
        </form>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="py-10 px-6 bg-gray-900 text-gray-300">
        <div className="max-w-6xl mx-auto grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-bold text-white mb-3 text-lg">Ngotack App</h3>
            <p className="text-sm">Platform belajar coding untuk IT enthusiast.</p>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">Menu</h4>
            <ul className="space-y-2 text-sm">
              <li>Courses</li>
              <li>Roadmaps</li>
              <li>About</li>
              <li>Contact</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">Support</h4>
            <ul className="space-y-2 text-sm">
              <li>FAQ</li>
              <li>Privacy</li>
              <li>Terms</li>
              <li>Help Center</li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-white mb-2">Connect</h4>
            <ul className="space-y-2 text-sm">
              <li>Email</li>
              <li>Instagram</li>
              <li>Github</li>
            </ul>
          </div>
        </div>

        <div className="text-center mt-10 text-sm opacity-70">© {new Date().getFullYear()} Ngotack App — All rights reserved.</div>
      </footer>
    </main>
  );
}
