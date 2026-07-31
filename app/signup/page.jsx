"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

export default function SignupPage() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSignup(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName },
      },
    });

    setLoading(false);

    if (error) {
      if (error.message.includes("already registered")) {
        setMessage("هذا البريد الإلكتروني مسجل مسبقاً. جرّب تسجيل الدخول.");
      } else if (error.message.includes("Password")) {
        setMessage("كلمة المرور يجب أن تكون 6 أحرف على الأقل.");
      } else {
        setMessage("حدث خطأ: " + error.message);
      }
      return;
    }

    setSuccess(true);
    setMessage("تم إنشاء حسابك! تحقق من بريدك الإلكتروني (" + email + ") لتأكيد التسجيل.");

    setTimeout(() => {
      router.push("/login");
    }, 4000);
  }

  return (
    <div dir="rtl" style={{ minHeight: "100vh", background: "#0A1628", color: "#F3ECD8", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
      <div style={{ maxWidth: 400, width: "100%", padding: 32 }}>
        <h1 style={{ fontSize: 28, marginBottom: 24, textAlign: "center" }}>إنشاء حساب جديد</h1>

        {!success && (
          <form onSubmit={handleSignup}>
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
                minLength={6}
                style={{ width: "100%", padding: 10, marginTop: 6, borderRadius: 8, border: "1px solid #C9A22755", background: "#F3ECD811", color: "#F3ECD8" }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              style={{ width: "100%", padding: 12, borderRadius: 30, background: "#C9A227", color: "#0A1628", border: "none", fontWeight: "bold", cursor: "pointer" }}
            >
              {loading ? "..." : "إنشاء الحساب"}
            </button>
          </form>
        )}

        {message && (
          <p style={{ marginTop: 20, textAlign: "center", color: success ? "#3E5C4E" : "#C9A227", fontSize: 14, lineHeight: 1.6 }}>
            {message}
          </p>
        )}

        <p style={{ marginTop: 24, textAlign: "center", fontSize: 14, opacity: 0.7 }}>
          لديك حساب بالفعل؟{" "}
          <Link href="/login" style={{ color: "#C9A227", fontWeight: "bold" }}>
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
