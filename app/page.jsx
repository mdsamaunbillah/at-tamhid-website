"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Globe, GraduationCap, Play, Lock, ArrowLeft, Sparkles } from "lucide-react";
import { supabase } from "../lib/supabaseClient";

export default function Home() {
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchCourses() {
      let query = supabase.from("courses").select("*").eq("published", true);
      if (filter !== "all") query = query.eq("type", filter);
      const { data } = await query;
      setCourses(data || []);
    }
    fetchCourses();
  }, [filter]);

  return (
    <div dir="rtl" className="min-h-screen w-full" style={{ background: "#0A1628", color: "#F3ECD8" }}>
      {/* Nav */}
      <header className="border-b" style={{ borderColor: "#C9A22733" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="At Tamhid Institute" width={40} height={40} style={{ borderRadius: 8 }} />
            <span className="text-lg tracking-wide">معهد التمهيد</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="opacity-70 hover:opacity-100">الرئيسية</Link>
            <Link href="/courses" className="opacity-70 hover:opacity-100">الدورات</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm px-4 py-2 rounded-full font-semibold" style={{ background: "#C9A227", color: "#0A1628" }}>
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-6xl mx-auto px-6 pt-16">
        <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#9A3324" }}>
          معهد التمهيد
        </div>
        <h1 className="text-5xl md:text-7xl mb-2">التمهيد</h1>
        <p className="text-base md:text-lg opacity-60 mb-8">للترجمة القانونية والاستشارات القنصلية</p>

        <p className="text-2xl md:text-3xl leading-snug mb-6 max-w-2xl" style={{ color: "#C9A227" }}>
          باب العلم مفتوح، والسند موصول
        </p>
        <p className="text-base opacity-75 mb-8 max-w-md">
          دورات ودبلومات في العلوم الإسلامية واللغة العربية — منها ما هو مجاني بشهادة فورية، ومنها ما هو بمقابل بإشراف مباشر.
        </p>
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full font-semibold"
          style={{ background: "#C9A227", color: "#0A1628" }}
        >
          تصفح الدورات
          <ArrowLeft size={16} />
        </Link>
      </section>

      {/* Catalog preview */}
      <section className="mt-24" style={{ background: "#F3ECD8", color: "#0A1628" }}>
        <div className="max-w-6xl mx-auto px-6 py-16">
          <div className="flex flex-wrap items-end justify-between gap-6 mb-10">
            <div>
              <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#9A3324" }}>الفهرس</div>
              <h2 className="text-3xl md:text-4xl">اختر بابك في العلم</h2>
            </div>
            <div className="flex gap-2">
              {["all", "free", "paid"].map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className="text-sm px-4 py-1.5 rounded-full border"
                  style={
                    filter === f
                      ? { background: "#0A1628", color: "#F3ECD8", borderColor: "#0A1628" }
                      : { borderColor: "#0A162833", color: "#0A1628" }
                  }
                >
                  {f === "all" ? "الكل" : f === "free" ? "مجاني" : "مدفوع"}
                </button>
              ))}
            </div>
          </div>

          <div>
            {courses.map((c, idx) => (
              <div key={c.id} className="flex items-center gap-6 py-6 border-t last:border-b" style={{ borderColor: "#0A162822" }}>
                <span className="text-2xl w-10 shrink-0 opacity-30">{String(idx + 1).padStart(2, "0")}</span>
                <GraduationCap size={22} style={{ color: "#9A3324" }} className="shrink-0" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-xl mb-1">{c.title_ar}</h3>
                  <div className="text-xs opacity-60">{c.category}</div>
                </div>
                <div className="hidden sm:flex flex-col text-xs shrink-0 w-40" style={{ color: c.type === "free" ? "#3E5C4E" : "#9A3324" }}>
                  <span className="flex items-center gap-1 font-semibold">
                    {c.type === "paid" && <Lock size={11} />}
                    {c.type === "free" ? "مجاني" : `৳${c.price}`}
                  </span>
                </div>
                <Link
                  href="/courses"
                  className="flex items-center gap-1.5 text-sm px-4 py-2 rounded-full font-semibold shrink-0"
                  style={{ background: "#0A1628", color: "#F3ECD8" }}
                >
                  التسجيل
                  <ArrowLeft size={13} />
                </Link>
              </div>
            ))}
            {courses.length === 0 && <p className="py-8 text-center opacity-60">لا توجد دورات بعد. أضفها من لوحة الإدارة.</p>}
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 flex items-center justify-center gap-2">
        <Sparkles size={12} style={{ color: "#C9A227" }} />
        <span className="text-sm opacity-50">معهد التمهيد — دكا، بنغلاديش</span>
      </footer>
    </div>
  );
}
