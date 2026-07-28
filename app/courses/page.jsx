"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../lib/supabaseClient";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    async function fetchCourses() {
      let query = supabase.from("courses").select("*").eq("published", true);
      if (filter !== "all") query = query.eq("type", filter);
      const { data, error } = await query;
      if (!error) setCourses(data);
      setLoading(false);
    }
    fetchCourses();
  }, [filter]);

  async function handleEnroll(courseId, courseType) {
    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      alert("يرجى تسجيل الدخول أولاً");
      return;
    }

    const status = courseType === "free" ? "active" : "pending_payment";

    const { error } = await supabase.from("enrollments").insert({
      user_id: userData.user.id,
      course_id: courseId,
      status,
    });

    if (error) {
      alert("خطأ: " + error.message);
    } else if (courseType === "free") {
      alert("تم التسجيل! يمكنك البدء الآن.");
    } else {
      alert("تم إنشاء طلب التسجيل. يرجى إتمام الدفع لتفعيل الدورة.");
    }
  }

  return (
    <div dir="rtl" style={{ maxWidth: 900, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>الدورات والدبلومات</h1>

      <div style={{ display: "flex", gap: 8, marginBottom: 24 }}>
        {["all", "free", "paid"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              padding: "6px 16px",
              borderRadius: 20,
              border: "1px solid #ccc",
              background: filter === f ? "#0B1B33" : "#fff",
              color: filter === f ? "#fff" : "#000",
            }}
          >
            {f === "all" ? "الكل" : f === "free" ? "مجاني" : "مدفوع"}
          </button>
        ))}
      </div>

      {loading && <p>جاري التحميل...</p>}
      {!loading && courses.length === 0 && <p>لا توجد دورات منشورة بعد.</p>}

      <div style={{ display: "grid", gap: 16 }}>
        {courses.map((c) => (
          <div key={c.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16 }}>
            <h3>{c.title_ar}</h3>
            <p style={{ opacity: 0.7, fontSize: 14 }}>{c.description_ar}</p>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span
                style={{
                  fontSize: 12,
                  padding: "2px 10px",
                  borderRadius: 12,
                  background: c.type === "free" ? "#1F4D3E" : "#B8912F",
                  color: c.type === "free" ? "#fff" : "#0B1B33",
                }}
              >
                {c.type === "free" ? "مجاني" : `مدفوع — ${c.price} ৳`}
              </span>
              <button
                onClick={() => handleEnroll(c.id, c.type)}
                style={{ padding: "8px 20px", borderRadius: 20, background: "#0B1B33", color: "#fff", border: "none" }}
              >
                التسجيل
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
