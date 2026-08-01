"use client";
import { useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });

    setLoading(false);

    if (error) {
      setMessage("حدث خطأ: " + error.message);
    } else {
      setMessage("تم إرسال رابط إعادة تعيين كلمة المرور إلى بريدك الإلكتروني.");
    }
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 32 }}>
        <h1 style={{ fontSize: 26, marginBottom: 12, textAlign: "center" }}>نسيت كلمة المرور؟</h1>
        <p style={{ fontSize: 14, opacity: 0.7, textAlign: "center", marginBottom: 24 }}>
          أدخل بريدك الإلكتروني وسنرسل لك رابط إعادة تعيين كلمة المرور.
        </p>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, opacity: 0.8 }}>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: 12, borderRadius: 30, background: "#C9A227", color: "#0A1628", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "..." : "إرسال رابط إعادة التعيين"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 20, textAlign: "center", color: "#C9A227", fontSize: 14, lineHeight: 1.6 }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, opacity: 0.7 }}>
          <Link href="/login" style={{ color: "#C9A227", fontWeight: "bold" }}>
            العودة لتسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
