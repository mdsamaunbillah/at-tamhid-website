"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";
import Link from "next/link";
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

  // একটা লেসন "সম্পন্ন" মার্ক করা — সব লেসন শেষ হলে অটো সার্টিফিকেট ইস্যু হবে
  async function markLessonComplete(enrollment, lessonId, totalLessons) {
    const updatedLessons = Array.from(new Set([...(enrollment.completed_lessons || []), lessonId]));
    const progress = Math.round((updatedLessons.length / totalLessons) * 100);
    const isComplete = progress >= 100;

    await supabase
      .from("enrollments")
      .update({
        completed_lessons: updatedLessons,
        progress,
        status: isComplete ? "completed" : "active",
      })
      .eq("id", enrollment.id);

    if (isComplete && enrollment.courses.type === "free") {
      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      await issueCertificate({
        userId: user.id,
        userName: profile?.full_name,
        courseId: enrollment.course_id,
        courseTitle: enrollment.courses.title_ar,
      });
    }

    // পেজ রিফ্রেশ করে নতুন ডেটা লোড করা
    window.location.reload();
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: 60 }}>جاري التحميل...</p>;
  if (!user) return <p style={{ textAlign: "center", marginTop: 60 }}>يرجى تسجيل الدخول أولاً.</p>;

  return (
    <div dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
  <h1>لوحة الطالب</h1>
  <Link href="/dashboard/profile" style={{ fontSize: 14, color: "#C9A227" }}>
    الملف الشخصي ⚙️
  </Link>
</div>

      <h2 style={{ marginTop: 32 }}>دوراتي</h2>
      {enrollments.length === 0 && <p>لم تسجل في أي دورة بعد.</p>}
      {enrollments.map((e) => (
        <div key={e.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <h3>{e.courses?.title_ar}</h3>
          <p>الحالة: {e.status === "completed" ? "مكتملة ✅" : e.status === "pending_payment" ? "بانتظار الدفع ⏳" : "نشطة"}</p>
          <div style={{ background: "#eee", borderRadius: 8, height: 8, marginTop: 8 }}>
            <div
              style={{
                width: `${e.progress || 0}%`,
                background: "#B8912F",
                height: 8,
                borderRadius: 8,
              }}
            />
          </div>
          <p style={{ fontSize: 12, opacity: 0.6 }}>{e.progress || 0}% مكتمل</p>
        </div>
      ))}

      <h2 style={{ marginTop: 32 }}>شهاداتي</h2>
      {certificates.length === 0 && <p>لا توجد شهادات بعد.</p>}
      {certificates.map((c) => (
        <div key={c.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <p>{c.courses?.title_ar}</p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>رقم الشهادة: {c.certificate_number}</p>
          <a href={c.pdf_url} target="_blank" rel="noreferrer">
            تحميل الشهادة (PDF)
          </a>
        </div>
      ))}
    </div>
  );
}
