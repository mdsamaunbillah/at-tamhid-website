"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "../../lib/supabaseClient";

export default function ResetPasswordPage() {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    // Supabase নিজে থেকেই লিংকের access_token পড়ে সেশন বানিয়ে নেয় (detectSessionInUrl)
    const { data: listener } = supabase.auth.onAuthStateChange((event) => {
      if (event === "PASSWORD_RECOVERY") {
        setReady(true);
      }
    });

    supabase.auth.getSession().then(({ data }) => {
      if (data?.session) setReady(true);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setMessage("");

    if (password.length < 6) {
      setMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      return;
    }
    if (password !== confirmPassword) {
      setMessage("كلمتا المرور غير متطابقتين.");
      return;
    }

    setLoading(true);
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);

    if (error) {
      setMessage("حدث خطأ: " + error.message);
    } else {
      setMessage("تم تغيير كلمة المرور بنجاح! جاري تحويلك لتسجيل الدخول...");
      setTimeout(() => router.push("/login"), 2500);
    }
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 32 }}>
        <h1 style={{ fontSize: 26, marginBottom: 24, textAlign: "center" }}>إعادة تعيين كلمة المرور</h1>

        {!ready && !message && (
          <p style={{ textAlign: "center", opacity: 0.7 }}>جاري التحقق من الرابط...</p>
        )}

        {ready && (
          <form onSubmit={handleSubmit}>
            <div style={{ marginBottom: 14 }}>
              <label style={{ fontSize: 14, opacity: 0.8 }}>كلمة المرور الجديدة</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
              />
            </div>
            <div style={{ marginBottom: 20 }}>
              <label style={{ fontSize: 14, opacity: 0.8 }}>تأكيد كلمة المرور</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
                style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: 12, borderRadius: 30, background: "#C9A227", color: "#0A1628", border: "none", fontWeight: "bold", cursor: "pointer" }}
            >
              {loading ? "..." : "تغيير كلمة المرور"}
            </button>
          </form>
        )}

        {message && (
          <p style={{ marginTop: 20, textAlign: "center", color: "#C9A227", fontSize: 14, lineHeight: 1.6 }}>
            {message}
          </p>
        )}
      </div>
    </div>
  );
}
