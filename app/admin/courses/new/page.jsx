"use client";
import { useState } from "react";
import { supabase } from "../../lib/supabaseClient";

// Route: app/admin/courses/new/page.jsx

export default function NewCoursePage() {
  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    category: "",
    type: "free",
    price: 0,
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  function update(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();

    const { error } = await supabase.from("courses").insert({
      ...form,
      price: form.type === "paid" ? Number(form.price) : 0,
      instructor_id: userData?.user?.id,
      published: true,
    });

    setLoading(false);

    if (error) {
      setMessage("خطأ: " + error.message);
    } else {
      setMessage("تم إضافة الدورة بنجاح!");
      setForm({ title_ar: "", title_en: "", description_ar: "", category: "", type: "free", price: 0 });
    }
  }

  return (
    <div dir="rtl" style={{ maxWidth: 500, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>إضافة دورة جديدة</h1>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>عنوان الدورة (بالعربية)</label>
          <input
            value={form.title_ar}
            onChange={(e) => update("title_ar", e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Course Title (English)</label>
          <input
            value={form.title_en}
            onChange={(e) => update("title_en", e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>الوصف</label>
          <textarea
            value={form.description_ar}
            onChange={(e) => update("description_ar", e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>التصنيف (مثال: نحو، فقه، تفسير)</label>
          <input
            value={form.category}
            onChange={(e) => update("category", e.target.value)}
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>النوع</label>
          <select value={form.type} onChange={(e) => update("type", e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option value="free">مجاني</option>
            <option value="paid">مدفوع</option>
          </select>
        </div>
        {form.type === "paid" && (
          <div style={{ marginBottom: 12 }}>
            <label>السعر (৳)</label>
            <input
              type="number"
              value={form.price}
              onChange={(e) => update("price", e.target.value)}
              style={{ width: "100%", padding: 8 }}
            />
          </div>
        )}
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#0B1B33", color: "#fff", border: "none", borderRadius: 8 }}>
          {loading ? "..." : "إضافة الدورة"}
        </button>
      </form>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
      <p style={{ fontSize: 12, opacity: 0.6, marginTop: 16 }}>
        ملاحظة: إضافة الدروس والفيديوهات لهذه الدورة ستتم من صفحة إدارة منفصلة لاحقاً.
      </p>
    </div>
  );
}
