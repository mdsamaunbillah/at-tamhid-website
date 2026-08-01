"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../../lib/supabaseClient";

export default function ProfilePage() {
  const [user, setUser] = useState(null);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [city, setCity] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }
      setUser(userData.user);

      const { data: profile } = await supabase
        .from("profiles")
        .select("full_name, phone, city")
        .eq("id", userData.user.id)
        .single();

      setFullName(profile?.full_name || "");
      setPhone(profile?.phone || "");
      setCity(profile?.city || "");
      setLoading(false);
    }
    load();
  }, []);

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    const { error } = await supabase
      .from("profiles")
      .update({ full_name: fullName, phone, city })
      .eq("id", user.id);

    setSaving(false);

    if (error) {
      setMessage("حدث خطأ: " + error.message);
    } else {
      setMessage("تم حفظ التغييرات بنجاح!");
    }
  }

  if (loading)
    return (
      <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        جاري التحميل...
      </div>
    );

  if (!user)
    return (
      <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        يرجى تسجيل الدخول أولاً.
      </div>
    );

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 500, margin: "0 auto", padding: "60px 24px" }}>
        <Link href="/dashboard" style={{ color: "#C9A227", fontSize: 14 }}>
          → العودة إلى لوحة التحكم
        </Link>

        <h1 style={{ fontSize: 28, margin: "20px 0 30px" }}>الملف الشخصي</h1>

        <form onSubmit={handleSave}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 14, opacity: 0.8 }}>البريد الإلكتروني</label>
            <input
              type="text"
              value={user.email}
              disabled
              style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22733", background: "#F3ECD808", color: "#F3ECD888" }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 14, opacity: 0.8 }}>الاسم الكامل</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
            />
          </div>

          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 14, opacity: 0.8 }}>رقم الهاتف</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="01XXXXXXXXX"
              style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
            />
          </div>

          <div style={{ marginBottom: 24 }}>
            <label style={{ fontSize: 14, opacity: 0.8 }}>المدينة</label>
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="دكا"
              style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
            />
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{ width: "100%", padding: 12, borderRadius: 30, background: "#C9A227", color: "#0A1628", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            {saving ? "..." : "حفظ التغييرات"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 20, textAlign: "center", color: "#C9A227", fontSize: 14 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
