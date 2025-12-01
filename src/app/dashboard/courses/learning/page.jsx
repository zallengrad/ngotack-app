"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import { Quicksand, Montserrat } from "next/font/google";
import { FiCheck } from "react-icons/fi";
import { COURSES, getCourseById } from "@/config/courses";

const quicksand = Quicksand({ subsets: ["latin"], weight: ["600", "700"], display: "swap" });
const montserrat = Montserrat({ subsets: ["latin"], weight: ["400", "600"], display: "swap" });

const progressKey = (courseId) => `ngotack-progress-${courseId}`;

function loadProgress(courseId) {
  if (typeof window === "undefined") return [];
  try {
    const stored = JSON.parse(localStorage.getItem(progressKey(courseId)) || "null");
    if (stored && Array.isArray(stored.completedMaterialIds)) {
      return stored.completedMaterialIds;
    }
  } catch {
    //
  }
  return [];
}

function saveProgress(courseId, completedMaterialIds) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      progressKey(courseId),
      JSON.stringify({ completedMaterialIds })
    );
  } catch {
    //
  }
}

export default function LearningPage() {
  const container = "max-w-[1400px]";
  const searchParams = useSearchParams();
  const router = useRouter();

  const courseId = searchParams.get("course") || "frontend-basic";
  const course = useMemo(() => getCourseById(courseId), [courseId]);
  const materials = course.materials;
  const examMaterialId = materials[materials.length - 1].id;

  const paramMaterial = searchParams.get("m");
  const firstMaterialId = materials[0].id;

  const [activeMaterialId, setActiveMaterialId] = useState(firstMaterialId);
  const [completedMaterials, setCompletedMaterials] = useState([]);

  useEffect(() => {
    const completed = loadProgress(courseId);
    setCompletedMaterials(completed);

    const parsed = paramMaterial ? parseInt(paramMaterial, 10) : NaN;
    if (!Number.isNaN(parsed) && materials.some((m) => m.id === parsed)) {
      setActiveMaterialId(parsed);
    } else {
      setActiveMaterialId(firstMaterialId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId]);

  const completedSet = new Set(completedMaterials);
  const activeIndex = materials.findIndex((m) => m.id === activeMaterialId);

  let highestCompletedIndex = -1;
  materials.forEach((m, idx) => {
    if (completedSet.has(m.id) && idx > highestCompletedIndex) {
      highestCompletedIndex = idx;
    }
  });

  const activeMaterial =
    materials.find((m) => m.id === activeMaterialId) || materials[0];

  const progress = Math.round((completedSet.size / materials.length) * 100);

  function goToQuiz() {
    router.push(`/dashboard/courses/learning/quiz?course=${courseId}`);
  }

  function handleNext() {
    if (activeIndex === -1) return;

    const currentId = materials[activeIndex].id;

    setCompletedMaterials((prev) => {
      const set = new Set(prev);
      set.add(currentId);
      const arr = Array.from(set);
      saveProgress(courseId, arr);
      return arr;
    });

    if (activeIndex < materials.length - 1) {
      const nextId = materials[activeIndex + 1].id;
      if (nextId === examMaterialId) {
        goToQuiz();
      } else {
        setActiveMaterialId(nextId);
      }
    } else {
      goToQuiz();
    }
  }

  function handlePrev() {
    if (activeIndex > 0) {
      setActiveMaterialId(materials[activeIndex - 1].id);
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f7f9]">
      {/* HEADER */}
      <header className="w-full border-b border-gray-200 bg-white">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center`}>
          <Link
            href="/dashboard/courses"
            className={`${montserrat.className} inline-flex items-center text-sm text-black`}
          >
            <span className="mr-2">←</span> {course.title}
          </Link>
        </div>
      </header>

      {/* MAIN */}
      <main className={`${container} mx-auto px-6 lg:px-10 py-10 flex-1 w-full flex flex-col`}>
        <div className="flex flex-col md:flex-row gap-8">
          {/* Konten */}
          <div className="flex-1 bg-white rounded-xl shadow-sm border border-gray-200 p-8">
            <h1 className={`${quicksand.className} text-2xl md:text-3xl font-bold text-black mb-6`}>
              {activeMaterial.title}
            </h1>

            <div className={`${montserrat.className} space-y-8 text-sm md:text-base text-black leading-relaxed`}>
              {activeMaterial.sections.map((section, idx) => (
                <section key={idx}>
                  <h2 className="font-semibold text-base md:text-lg mb-3">{section.subtitle}</h2>
                  {section.paragraphs.map((p, i) => (
                    <p key={i} className="mb-2">
                      {p}
                    </p>
                  ))}
                </section>
              ))}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="w-full md:w-80 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className={`${quicksand.className} text-lg font-semibold text-black mb-4`}>Daftar Materi</h3>

            <div className={`${montserrat.className} text-sm text-black`}>
              <div className="flex items-center justify-between mb-2">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
              <div className="h-2 rounded-full bg-gray-200 overflow-hidden mb-6">
                <div
                  className="h-full bg-[#36D7B7] transition-all duration-300"
                  style={{ width: `${progress}%` }}
                />
              </div>

              <div className="space-y-3">
                {materials.map((material, index) => {
                  const isActive = material.id === activeMaterialId;
                  const isCompleted = completedSet.has(material.id);

                  const canClick =
                    index <= highestCompletedIndex || material.id === activeMaterialId;

                  const baseClasses =
                    "flex items-center justify-between px-4 py-3 rounded-lg border text-sm transition-colors w-full text-left";

                  const bgColor = isActive
                    ? "bg-[#36D7B7] border-[#36D7B7] text-white"
                    : isCompleted
                    ? "bg-[#b7f0d4] border-[#7bd6b6] text-black"
                    : "bg-[#e5e7eb] border-[#d1d5db] text-black";

                  function handleClick() {
                    if (!canClick) return;
                    if (material.id === examMaterialId) {
                      goToQuiz();
                    } else {
                      setActiveMaterialId(material.id);
                    }
                  }

                  return (
                    <button
                      key={material.id}
                      type="button"
                      disabled={!canClick}
                      onClick={handleClick}
                      className={`${baseClasses} ${bgColor} ${
                        !canClick
                          ? "cursor-not-allowed opacity-60"
                          : "cursor-pointer hover:bg-[#c6f5dd]"
                      }`}
                    >
                      <span className="truncate">{material.title}</span>
                      {isCompleted && (
                        <span className="ml-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-white">
                          <FiCheck className="text-base text-[#16a34a]" />
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      </main>

      {/* FOOTER NAV */}
      <footer className="border-t border-gray-200 bg-white mt-6">
        <div className={`${container} mx-auto px-6 lg:px-10 py-4 flex items-center justify-between`}>
          <button
            type="button"
            disabled={activeIndex === 0}
            onClick={handlePrev}
            className={`${montserrat.className} text-sm flex items-center gap-2 text-black disabled:opacity-40 disabled:cursor-not-allowed hover:underline hover:-translate-x-[1px] transition`}
          >
            ← Materi Sebelumnya
          </button>

          <span className={`${quicksand.className} text-sm md:text-base font-semibold text-black`}>
            Materi Ini
          </span>

          <button
            type="button"
            onClick={handleNext}
            className={`${montserrat.className} text-sm flex items-center gap-2 text-black hover:underline hover:translate-x-[1px] transition`}
          >
            Materi Selanjutnya →
          </button>
        </div>
      </footer>
    </div>
  );
}
