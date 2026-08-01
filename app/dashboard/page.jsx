"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";
import { issueCertificate } from "../../lib/certificate";

export default function DashboardPage() {
  const [user, setUser] = useState(null);
  const [enrollments, setEnrollments] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      setUser(userData.user);

      const { data: enrollData } = await supabase
        .from("enrollments")
        .select("*, courses(*)")
        .eq("user_id", userData.user.id);
      setEnrollments(enrollData || []);

      const { data: certData } = await supabase
        .from("certificates")
        .select("*, courses(title_ar)")
        .eq("user_id", userData.user.id);
      setCertificates(certData || []);

      setLoading(false);
    }
    load();
  }, []);

  async function markLessonComplete(enrollment, lessonId, totalLessons) {
    const updatedLessons = Array.from(new Set([...(enrollment.completed_lessons || []), lessonId]));
    const progress = Math.round((updatedLessons.length / totalLessons) * 100);
    const isComplete = progress >= 100;

    await supabase
      .from("enrollments")
      .update({
        completed_lessons: updatedLessons,
        progress: progress,
        status: isComplete ? "completed" : "active",
      })
      .eq("id", enrollment.id);

    if (isComplete && enrollment.courses.type === "free") {
      const profileResult = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      await issueCertificate({
        userId: user.id,
        userName: profileResult.data ? profileResult.data.full_name : "",
        courseId: enrollment.course_id,
        courseTitle: enrollment.courses.title_ar,
      });
    }
    window.location.reload();
  }

  function statusLabel(status) {
    if (status === "completed") {
      return { text: "مكتملة ✅", color: "#3E5C4E" };
    }
    if (status === "pending_payment") {
      return { text: "بانتظار الدفع ⏳", color: "#9A3324" };
    }
    return { text: "نشطة", color: "#C9A227" };
  }

  if (loading) {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        جاري التحميل...
      </div>
    );
  }

  if (!user) {
    return (
      <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, fontFamily: "sans-serif" }}>
        <p>يرجى تسجيل الدخول أولاً.</p>
        <Link href="/login" style={{ color: "#C9A227", fontWeight: "bold" }}>
          تسجيل الدخول
        </Link>
      </div>
    );
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", fontFamily: "sans-serif" }}>
      <header style={{ borderBottom: "1px solid #C9A22733" }}>
        <div style={{ maxWidth: 900, margin: "0 auto", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ display: "flex", alignItems: "center", gap: 12, textDecoration: "none", color: "#F3ECD8" }}>
            <Image src="/logo.jpg" alt="At Tamhid Institute" width={36} height={36} style={{ borderRadius: 8 }} />
            <span style={{ fontSize: 16 }}>معهد التمهيد</span>
          </Link>
          <Link href="/dashboard/profile" style={{ fontSize: 14, color: "#C9A227", textDecoration: "none" }}>
            الملف الشخصي
          </Link>
        </div>
      </header>

      <div style={{ maxWidth: 900, margin: "0 auto", padding: "50px 24px" }}>
        <div style={{ fontSize: 12, letterSpacing: 2, textTransform: "uppercase", color: "#9A3324", marginBottom: 8 }}>
          لوحة التحكم
        </div>
        <h1 style={{ fontSize: 30, marginBottom: 40 }}>دوراتي</h1>

        {enrollments.length === 0 ? <p style={{ opacity: 0.6, marginBottom: 40 }}>لم تسجل في أي دورة بعد.</p> : null}

        <div style={{ display: "grid", gap: 16, marginBottom: 50 }}>
          {enrollments.map(function (e) {
            const s = statusLabel(e.status);
            return (
              <div key={e.id} style={{ background: "#F3ECD811", border: "1px solid #C9A22733", borderRadius: 16, padding: 20 }}>
                <h3 style={{ fontSize: 18, marginBottom: 6 }}>{e.courses ? e.courses.title_ar : ""}</h3>
                <p style={{ fontSize: 13, color: s.color, marginBottom: 12 }}>الحالة: {s.text}</p>
                <div style={{ background: "#F3ECD822", borderRadius: 20, height: 8 }}>
                  <div style={{ width: (e.progress || 0) + "%", background: "#C9A227", height: 8, borderRadius: 20 }} />
                </div>
                <p style={{ fontSize: 12, opacity: 0.6, marginTop: 8 }}>{e.progress || 0}% مكتمل</p>
              </div>
            );
          })}
        </div>

        <h2 style={{ fontSize: 22, marginBottom: 20 }}>شهاداتي</h2>
        {certificates.length === 0 ? <p style={{ opacity: 0.6 }}>لا توجد شهادات بعد.</p> : null}
        <div style={{ display: "grid", gap: 16 }}>
          {certificates.map(function (c) {
            return (
              <div key={c.id} style={{ background: "#F3ECD811", border: "1px solid #C9A22733", borderRadius: 16, padding: 20, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <p style={{ marginBottom: 4 }}>{c.courses ? c.courses.title_ar : ""}</p>
                  <p style={{ fontSize: 12, opacity: 0.6 }}>رقم الشهادة: {c.certificate_number}</p>
                </div>
                <a href={c.pdf_url} target="_blank" rel="noreferrer" style={{ fontSize: 13, padding: "8px 18px", borderRadius: 20, background: "#C9A227", color: "#0A1628", fontWeight: "bold", textDecoration: "none" }}>
                  تحميل PDF
                </a>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
