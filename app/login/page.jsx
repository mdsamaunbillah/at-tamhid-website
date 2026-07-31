"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    setLoading(false);

    if (error) {
      if (error.message.includes("Email not confirmed")) {
        setMessage("يرجى تأكيد بريدك الإلكتروني أولاً. تحقق من صندوق الوارد.");
      } else if (error.message.includes("Invalid login credentials")) {
        setMessage("البريد الإلكتروني أو كلمة المرور غير صحيحة.");
      } else {
        setMessage("حدث خطأ: " + error.message);
      }
      return;
    }

    router.push("/dashboard");
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24, textAlign: "center" }}>تسجيل الدخول</h1>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: 14 }}>
            <label style={{ fontSize: 14, opacity: 0.8 }}>البريد الإلكتروني</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
            />
          </div>
          <div style={{ marginBottom: 20 }}>
            <label style={{ fontSize: 14, opacity: 0.8 }}>كلمة المرور</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            style={{ width: "100%", padding: 12, borderRadius: 30, background: "#C9A227", color: "#0A1628", border: "none", fontWeight: "bold", cursor: "pointer" }}
          >
            {loading ? "..." : "دخول"}
          </button>
        </form>

        {message && (
          <p style={{ marginTop: 20, textAlign: "center", color: "#C9A227", fontSize: 14, lineHeight: 1.6 }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, opacity: 0.7 }}>
          ليس لديك حساب؟{" "}
          <Link href="/signup" style={{ color: "#C9A227", fontWeight: "bold" }}>
            إنشاء حساب جديد
          </Link>
        </p>

        <p style={{ marginTop: 12, textAlign: "center", fontSize: 13, opacity: 0.5 }}>
          <Link href="/forgot-password" style={{ color: "#C9A227" }}>
            نسيت كلمة المرور؟
          </Link>
        </p>
      </div>
    </div>
  );
}
