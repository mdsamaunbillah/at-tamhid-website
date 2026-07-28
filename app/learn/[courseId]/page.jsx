"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";
import { issueCertificate } from "../../../lib/certificate";

// Route: app/learn/[courseId]/page.jsx
// ব্যবহার: /learn/<course-id> এ গেলে এই পেজ খুলবে

export default function LearnPage() {
  const { courseId } = useParams();
  const [user, setUser] = useState(null);
  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [activeLesson, setActiveLesson] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      setUser(userData.user);

      const { data: courseData } = await supabase.from("courses").select("*").eq("id", courseId).single();
      setCourse(courseData);

      const { data: moduleData } = await supabase
        .from("modules")
        .select("*, lessons(*)")
        .eq("course_id", courseId)
        .order("order_index");
      setModules(moduleData || []);
      if (moduleData?.[0]?.lessons?.[0]) setActiveLesson(moduleData[0].lessons[0]);

      const { data: enrollData } = await supabase
        .from("enrollments")
        .select("*")
        .eq("user_id", userData.user.id)
        .eq("course_id", courseId)
        .single();
      setEnrollment(enrollData);

      setLoading(false);
    }
    load();
  }, [courseId]);

  const allLessons = modules.flatMap((m) => m.lessons || []);
  const totalLessons = allLessons.length;
  const isCompleted = (lessonId) => enrollment?.completed_lessons?.includes(lessonId);

  async function markComplete(lessonId) {
    if (!enrollment) return;
    const updated = Array.from(new Set([...(enrollment.completed_lessons || []), lessonId]));
    const progress = Math.round((updated.length / totalLessons) * 100);
    const done = progress >= 100;

    const { data: newEnrollment } = await supabase
      .from("enrollments")
      .update({ completed_lessons: updated, progress, status: done ? "completed" : "active" })
      .eq("id", enrollment.id)
      .select()
      .single();

    setEnrollment(newEnrollment);

    if (done && course.type === "free") {
      const { data: profile } = await supabase.from("profiles").select("full_name").eq("id", user.id).single();
      await issueCertificate({
        userId: user.id,
        userName: profile?.full_name,
        courseId: course.id,
        courseTitle: course.title_ar,
      });
      alert("تهانينا! لقد أكملت الدورة وتم إصدار شهادتك. تحقق من لوحة التحكم.");
    }
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: 60 }}>جاري التحميل...</p>;
  if (!user) return <p style={{ textAlign: "center", marginTop: 60 }}>يرجى تسجيل الدخول أولاً.</p>;
  if (enrollment?.status === "pending_payment")
    return <p style={{ textAlign: "center", marginTop: 60 }}>يجب إتمام الدفع لفتح هذه الدورة.</p>;

  return (
    <div dir="rtl" style={{ display: "flex", maxWidth: 1100, margin: "40px auto", fontFamily: "sans-serif", gap: 24 }}>
      {/* Sidebar — মডিউল ও লেসন লিস্ট */}
      <div style={{ width: 280, flexShrink: 0 }}>
        <h3>{course?.title_ar}</h3>
        {modules.map((m) => (
          <div key={m.id} style={{ marginBottom: 16 }}>
            <p style={{ fontWeight: "bold", fontSize: 14 }}>{m.title_ar}</p>
            {(m.lessons || [])
              .sort((a, b) => a.order_index - b.order_index)
              .map((l) => (
                <div
                  key={l.id}
                  onClick={() => setActiveLesson(l)}
                  style={{
                    padding: "8px 10px",
                    borderRadius: 8,
                    cursor: "pointer",
                    background: activeLesson?.id === l.id ? "#F3ECD8" : "transparent",
                    fontSize: 13,
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <span>{l.title_ar}</span>
                  <span>{isCompleted(l.id) ? "✅" : ""}</span>
                </div>
              ))}
          </div>
        ))}
      </div>

      {/* মূল ভিডিও এরিয়া */}
      <div style={{ flex: 1 }}>
        {activeLesson ? (
          <>
            <div style={{ position: "relative", paddingBottom: "56.25%", height: 0 }}>
              <iframe
                src={`https://www.youtube.com/embed/${activeLesson.youtube_video_id}`}
                style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", borderRadius: 12 }}
                allowFullScreen
                title={activeLesson.title_ar}
              />
            </div>
            <h3 style={{ marginTop: 16 }}>{activeLesson.title_ar}</h3>
            <button
              onClick={() => markComplete(activeLesson.id)}
              disabled={isCompleted(activeLesson.id)}
              style={{
                padding: "10px 24px",
                borderRadius: 20,
                background: isCompleted(activeLesson.id) ? "#ccc" : "#0B1B33",
                color: "#fff",
                border: "none",
                marginTop: 8,
              }}
            >
              {isCompleted(activeLesson.id) ? "تم الإكمال ✅" : "وضع علامة كمكتمل"}
            </button>
          </>
        ) : (
          <p>لا توجد دروس بعد في هذه الدورة.</p>
        )}
      </div>
    </div>
  );
}
