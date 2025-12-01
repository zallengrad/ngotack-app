// src/config/courses.js

const lorem1 =
  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.";
const lorem2 =
  "Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.";
const lorem3 =
  "Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.";
const lorem4 =
  "Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.";

function makeSections(titles) {
  return titles.map((subtitle) => ({
    subtitle,
    paragraphs: [lorem1, lorem2, lorem3, lorem4],
  }));
}

export const COURSES = [
  // 1. Frontend basic
  {
    id: "frontend-basic",
    title: "Belajar Menjadi Front End Developer",
    shortTitle: "Front End Dasar",
    materials: [
      {
        id: 1,
        title: "Peran Front End Developer",
        sections: makeSections(["Gambaran Profesi", "Tanggung Jawab Utama", "Keterampilan Dasar"]),
      },
      {
        id: 2,
        title: "Fundamental Web",
        sections: makeSections(["Struktur Halaman", "Client vs Server", "Siklus Request/Response"]),
      },
      {
        id: 3,
        title: "Tools & Workflow",
        sections: makeSections(["Code Editor", "Browser DevTools", "Manajemen Proyek"]),
      },
      {
        id: 4,
        title: "Kolaborasi Tim",
        sections: makeSections(["Kolaborasi dengan Designer", "Kolaborasi dengan Backend", "Komunikasi Teknis"]),
      },
      {
        id: 5,
        title: "Studi Kasus Mini",
        sections: makeSections(["Deskripsi Kasus", "Analisis Kebutuhan", "Rancangan Solusi"]),
      },
      {
        id: 6,
        title: "Ujian Akhir",
        sections: makeSections(["Tujuan Ujian", "Panduan Pengerjaan"]),
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: "Peran utama seorang Front End Developer adalah .......",
        options: [
          { key: "a", text: "Mendesain database dan query" },
          { key: "b", text: "Mengelola infrastruktur jaringan" },
          { key: "c", text: "Membangun tampilan dan interaksi di sisi pengguna" },
          { key: "d", text: "Menulis skrip deployment CI/CD" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 2,
        question: "Teknologi yang paling erat terkait dengan front end adalah .......",
        options: [
          { key: "a", text: "HTML, CSS, dan JavaScript" },
          { key: "b", text: "Python, Go, dan Rust" },
          { key: "c", text: "MySQL, MongoDB, dan Redis" },
          { key: "d", text: "Kubernetes dan Docker" },
        ],
        correctOptionKey: "a",
      },
      {
        id: 3,
        question: "Istilah 'client-side' mengacu pada kode yang berjalan di .......",
        options: [
          { key: "a", text: "Server aplikasi" },
          { key: "b", text: "Browser pengguna" },
          { key: "c", text: "Database server" },
          { key: "d", text: "Container orchestrator" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 4,
        question: "DevTools biasanya disediakan oleh .......",
        options: [
          { key: "a", text: "Sistem operasi" },
          { key: "b", text: "Browser" },
          { key: "c", text: "Provider cloud" },
          { key: "d", text: "Database engine" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 5,
        question: "Salah satu tantangan front end adalah .......",
        options: [
          { key: "a", text: "Menjaga query SQL tetap optimal" },
          { key: "b", text: "Menangani perbedaan perilaku antar browser" },
          { key: "c", text: "Mengatur replikasi database" },
          { key: "d", text: "Mengelola cluster container" },
        ],
        correctOptionKey: "b",
      },
    ],
  },

  // 2. HTML & CSS
  {
    id: "html-css",
    title: "HTML & CSS Fundamentals",
    shortTitle: "HTML & CSS",
    materials: [
      {
        id: 1,
        title: "Struktur Dasar Dokumen HTML",
        sections: makeSections(["Tag Utama", "Head dan Body", "Semantic Tag"]),
      },
      {
        id: 2,
        title: "Elemen Teks & Multimedia",
        sections: makeSections(["Heading & Paragraph", "List & Link", "Gambar & Media"]),
      },
      {
        id: 3,
        title: "Dasar CSS",
        sections: makeSections(["Selector & Properti", "Inline vs Eksternal", "Unit dan Warna"]),
      },
      {
        id: 4,
        title: "Layout dengan Flexbox",
        sections: makeSections(["Main Axis & Cross Axis", "Alignment", "Responsiveness Sederhana"]),
      },
      {
        id: 5,
        title: "Responsive Web Design",
        sections: makeSections(["Media Query", "Breakpoint", "Mobile First"]),
      },
      {
        id: 6,
        title: "Ujian Akhir",
        sections: makeSections(["Tujuan Ujian", "Panduan Pengerjaan"]),
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: "Tag HTML yang digunakan untuk membuat paragraf adalah .......",
        options: [
          { key: "a", text: "<div>" },
          { key: "b", text: "<p>" },
          { key: "c", text: "<span>" },
          { key: "d", text: "<h1>" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 2,
        question: "Untuk menghubungkan file CSS eksternal digunakan tag .......",
        options: [
          { key: "a", text: "<style>" },
          { key: "b", text: "<link>" },
          { key: "c", text: "<script>" },
          { key: "d", text: "<meta>" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 3,
        question: "Properti CSS yang mengatur warna teks adalah .......",
        options: [
          { key: "a", text: "background-color" },
          { key: "b", text: "font-style" },
          { key: "c", text: "color" },
          { key: "d", text: "text-align" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 4,
        question: "Untuk membuat layout satu baris dengan Flexbox, digunakan properti .......",
        options: [
          { key: "a", text: "display: block;" },
          { key: "b", text: "display: inline;" },
          { key: "c", text: "display: flex;" },
          { key: "d", text: "display: grid;" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 5,
        question: "Media query digunakan untuk .......",
        options: [
          { key: "a", text: "Mengatur koneksi database" },
          { key: "b", text: "Menentukan gaya berdasarkan ukuran layar" },
          { key: "c", text: "Menjalankan JavaScript" },
          { key: "d", text: "Membuat animasi SVG" },
        ],
        correctOptionKey: "b",
      },
    ],
  },

  // 3. JavaScript dasar
  {
    id: "js-basic",
    title: "JavaScript Dasar untuk Web",
    shortTitle: "JavaScript Dasar",
    materials: [
      {
        id: 1,
        title: "Pengenalan JavaScript",
        sections: makeSections(["Sejarah Singkat", "Peran di Front End", "Runtime JavaScript"]),
      },
      {
        id: 2,
        title: "Variabel & Tipe Data",
        sections: makeSections(["let, const, var", "Tipe Primitif", "Tipe Referensi"]),
      },
      {
        id: 3,
        title: "Fungsi & Scope",
        sections: makeSections(["Deklarasi Fungsi", "Parameter & Return", "Scope & Closure"]),
      },
      {
        id: 4,
        title: "DOM Manipulation",
        sections: makeSections(["Mencari Elemen", "Mengubah Konten", "Menangani Event"]),
      },
      {
        id: 5,
        title: "Asynchronous JavaScript",
        sections: makeSections(["Callback", "Promise", "Async/Await"]),
      },
      {
        id: 6,
        title: "Ujian Akhir",
        sections: makeSections(["Tujuan Ujian", "Panduan Pengerjaan"]),
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: "Sintaks yang benar untuk mendeklarasikan variabel konstan adalah .......",
        options: [
          { key: "a", text: "var name =" },
          { key: "b", text: "let name =" },
          { key: "c", text: "const name =" },
          { key: "d", text: "static name =" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 2,
        question: "Metode untuk memilih elemen dengan id di DOM adalah .......",
        options: [
          { key: "a", text: "document.querySelectorAll" },
          { key: "b", text: "document.getElementById" },
          { key: "c", text: "document.getElementsByClassName" },
          { key: "d", text: "document.createElement" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 3,
        question: "Promise digunakan untuk menangani .......",
        options: [
          { key: "a", text: "Perulangan" },
          { key: "b", text: "Tipe data primitif" },
          { key: "c", text: "Operasi asinkron" },
          { key: "d", text: "Pengaturan CSS" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 4,
        question: "Keyword untuk menunggu Promise di dalam fungsi async adalah .......",
        options: [
          { key: "a", text: "then" },
          { key: "b", text: "await" },
          { key: "c", text: "wait" },
          { key: "d", text: "delay" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 5,
        question: "Event 'click' biasanya digunakan untuk .......",
        options: [
          { key: "a", text: "Menjalankan fungsi saat elemen ditekan" },
          { key: "b", text: "Mengubah warna otomatis" },
          { key: "c", text: "Memuat ulang halaman" },
          { key: "d", text: "Menutup browser" },
        ],
        correctOptionKey: "a",
      },
    ],
  },

  // 4. React basic
  {
    id: "react-basic",
    title: "React Dasar untuk Single Page Application",
    shortTitle: "React Dasar",
    materials: [
      {
        id: 1,
        title: "Konsep Dasar React",
        sections: makeSections(["Component-Based", "Virtual DOM", "Unidirectional Data Flow"]),
      },
      {
        id: 2,
        title: "Membuat Component",
        sections: makeSections(["Functional Component", "Props", "Komposisi Component"]),
      },
      {
        id: 3,
        title: "State & Lifecycle",
        sections: makeSections(["useState", "useEffect", "Pengelolaan State Sederhana"]),
      },
      {
        id: 4,
        title: "Handling Event & Form",
        sections: makeSections(["Event Handler", "Controlled Component", "Validasi Dasar"]),
      },
      {
        id: 5,
        title: "Routing Sederhana",
        sections: makeSections(["Konsep Routing", "Navigasi Halaman", "Protected Page Dasar"]),
      },
      {
        id: 6,
        title: "Ujian Akhir",
        sections: makeSections(["Tujuan Ujian", "Panduan Pengerjaan"]),
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: "React terutama digunakan untuk membangun .......",
        options: [
          { key: "a", text: "Database relasional" },
          { key: "b", text: "Antarmuka pengguna (UI)" },
          { key: "c", text: "Sistem operasi" },
          { key: "d", text: "CLI tools" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 2,
        question: "State di React digunakan untuk .......",
        options: [
          { key: "a", text: "Menyimpan konfigurasi server" },
          { key: "b", text: "Menyimpan data yang dapat berubah pada component" },
          { key: "c", text: "Mendefinisikan rute API" },
          { key: "d", text: "Mengatur CSS global" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 3,
        question: "Hook untuk menambahkan state di functional component adalah .......",
        options: [
          { key: "a", text: "useEffect" },
          { key: "b", text: "useState" },
          { key: "c", text: "useMemo" },
          { key: "d", text: "useRef" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 4,
        question: "Props di React bersifat .......",
        options: [
          { key: "a", text: "Dapat diubah langsung oleh child" },
          { key: "b", text: "Read-only di dalam component penerima" },
          { key: "c", text: "Hanya untuk style" },
          { key: "d", text: "Hanya untuk routing" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 5,
        question: "React Router digunakan untuk .......",
        options: [
          { key: "a", text: "Mengatur request ke server" },
          { key: "b", text: "Mengelola perpindahan halaman di aplikasi React" },
          { key: "c", text: "Mengelola state global" },
          { key: "d", text: "Menyimpan data ke database" },
        ],
        correctOptionKey: "b",
      },
    ],
  },

  // 5. Git & GitHub
  {
    id: "git-github",
    title: "Version Control dengan Git & GitHub",
    shortTitle: "Git & GitHub",
    materials: [
      {
        id: 1,
        title: "Konsep Dasar Version Control",
        sections: makeSections(["Mengapa Version Control", "Perbedaan Git vs ZIP", "Kolaborasi Tim"]),
      },
      {
        id: 2,
        title: "Git Dasar",
        sections: makeSections(["Inisialisasi Repository", "Staging & Commit", "Melihat Riwayat"]),
      },
      {
        id: 3,
        title: "Branch & Merge",
        sections: makeSections(["Membuat Branch", "Merge Dasar", "Menangani Konflik Sederhana"]),
      },
      {
        id: 4,
        title: "Remote Repository",
        sections: makeSections(["Konsep Remote", "Push & Pull", "Cloning Repository"]),
      },
      {
        id: 5,
        title: "Kolaborasi di GitHub",
        sections: makeSections(["Pull Request", "Code Review", "Issue Tracking"]),
      },
      {
        id: 6,
        title: "Ujian Akhir",
        sections: makeSections(["Tujuan Ujian", "Panduan Pengerjaan"]),
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: "Perintah untuk membuat repository Git baru adalah .......",
        options: [
          { key: "a", text: "git start" },
          { key: "b", text: "git new" },
          { key: "c", text: "git init" },
          { key: "d", text: "git create" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 2,
        question: "Perintah untuk mengirim commit ke remote repository adalah .......",
        options: [
          { key: "a", text: "git send" },
          { key: "b", text: "git push" },
          { key: "c", text: "git upload" },
          { key: "d", text: "git remote" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 3,
        question: "Branch digunakan untuk .......",
        options: [
          { key: "a", text: "Menghapus file lama" },
          { key: "b", text: "Menyimpan konfigurasi server" },
          { key: "c", text: "Menguji perubahan tanpa mengganggu main branch" },
          { key: "d", text: "Mengelola database" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 4,
        question: "Pull request biasanya digunakan untuk .......",
        options: [
          { key: "a", text: "Mengunduh repository" },
          { key: "b", text: "Mengusulkan perubahan ke branch utama" },
          { key: "c", text: "Menghapus branch" },
          { key: "d", text: "Membuat tag rilis" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 5,
        question: "Perintah untuk melihat riwayat commit adalah .......",
        options: [
          { key: "a", text: "git log" },
          { key: "b", text: "git status" },
          { key: "c", text: "git show" },
          { key: "d", text: "git diff" },
        ],
        correctOptionKey: "a",
      },
    ],
  },

  // 6. Backend intro
  {
    id: "backend-intro",
    title: "Pengenalan Backend & REST API",
    shortTitle: "Backend & API",
    materials: [
      {
        id: 1,
        title: "Konsep Backend",
        sections: makeSections(["Server Side", "Arsitektur Umum", "Komunikasi dengan Frontend"]),
      },
      {
        id: 2,
        title: "REST API Dasar",
        sections: makeSections(["Resource & Endpoint", "HTTP Method", "Status Code"]),
      },
      {
        id: 3,
        title: "Format Data",
        sections: makeSections(["JSON", "Request Body", "Response Body"]),
      },
      {
        id: 4,
        title: "Autentikasi Sederhana",
        sections: makeSections(["Token Dasar", "Session", "Validasi Request"]),
      },
      {
        id: 5,
        title: "Dokumentasi API",
        sections: makeSections(["Tujuan Dokumentasi", "Contoh Endpoint", "Kontrak Data"]),
      },
      {
        id: 6,
        title: "Ujian Akhir",
        sections: makeSections(["Tujuan Ujian", "Panduan Pengerjaan"]),
      },
    ],
    quizQuestions: [
      {
        id: 1,
        question: "Backend bertanggung jawab untuk .......",
        options: [
          { key: "a", text: "Mengatur tampilan antarmuka" },
          { key: "b", text: "Mengelola logika bisnis dan data" },
          { key: "c", text: "Membuat desain UI" },
          { key: "d", text: "Membuat animasi CSS" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 2,
        question: "HTTP method yang umum digunakan untuk mengambil data adalah .......",
        options: [
          { key: "a", text: "POST" },
          { key: "b", text: "PUT" },
          { key: "c", text: "GET" },
          { key: "d", text: "DELETE" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 3,
        question: "Format data yang paling sering digunakan di REST API adalah .......",
        options: [
          { key: "a", text: "XML" },
          { key: "b", text: "JSON" },
          { key: "c", text: "CSV" },
          { key: "d", text: "YAML" },
        ],
        correctOptionKey: "b",
      },
      {
        id: 4,
        question: "Status code 404 berarti .......",
        options: [
          { key: "a", text: "Request berhasil" },
          { key: "b", text: "Server error" },
          { key: "c", text: "Resource tidak ditemukan" },
          { key: "d", text: "Tidak terautentikasi" },
        ],
        correctOptionKey: "c",
      },
      {
        id: 5,
        question: "Dokumentasi API membantu tim untuk .......",
        options: [
          { key: "a", text: "Mengatur gaya CSS" },
          { key: "b", text: "Memahami cara menggunakan endpoint" },
          { key: "c", text: "Membuat desain UI" },
          { key: "d", text: "Mengelola repositori Git" },
        ],
        correctOptionKey: "b",
      },
    ],
  },
];

export function getCourseById(id) {
  return COURSES.find((c) => c.id === id) || COURSES[0];
}
