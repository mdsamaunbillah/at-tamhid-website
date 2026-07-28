"use client";
import { useState } from "react";
import { useParams } from "next/navigation";
import { supabase } from "../../../lib/supabaseClient";

// Route: app/pay/[courseId]/page.jsx

export default function PaymentPage() {
  const { courseId } = useParams();
  const [method, setMethod] = useState("bkash");
  const [transactionId, setTransactionId] = useState("");
  const [senderNumber, setSenderNumber] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const { data: userData } = await supabase.auth.getUser();
    if (!userData?.user) {
      setMessage("يرجى تسجيل الدخول أولاً");
      setLoading(false);
      return;
    }

    const { error } = await supabase.from("payments").insert({
      user_id: userData.user.id,
      course_id: courseId,
      method,
      transaction_id: transactionId,
      sender_number: senderNumber,
      status: "pending",
    });

    setLoading(false);

    if (error) {
      setMessage("خطأ: " + error.message);
    } else {
      setMessage("تم إرسال طلبك. سنتحقق من الدفع خلال 24 ساعة وسنقوم بتفعيل الدورة.");
    }
  }

  return (
    <div dir="rtl" style={{ maxWidth: 480, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>إتمام الدفع</h1>

      <div style={{ background: "#F3ECD8", padding: 16, borderRadius: 12, marginBottom: 24 }}>
        <p style={{ fontWeight: "bold" }}>خطوات الدفع:</p>
        <p>١. أرسل المبلغ عبر bKash أو Nagad إلى الرقم: <strong>+8801822510180</strong></p>
        <p>٢. انسخ رقم العملية (Transaction ID)</p>
        <p>٣. أدخل التفاصيل أدناه</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>طريقة الدفع</label>
          <select value={method} onChange={(e) => setMethod(e.target.value)} style={{ width: "100%", padding: 8 }}>
            <option value="bkash">bKash</option>
            <option value="nagad">Nagad</option>
          </select>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>رقم العملية (Transaction ID)</label>
          <input
            type="text"
            value={transactionId}
            onChange={(e) => setTransactionId(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>الرقم الذي أرسلت منه</label>
          <input
            type="text"
            value={senderNumber}
            onChange={(e) => setSenderNumber(e.target.value)}
            required
            style={{ width: "100%", padding: 8 }}
          />
        </div>
        <button type="submit" disabled={loading} style={{ width: "100%", padding: 10, background: "#0B1B33", color: "#fff", border: "none", borderRadius: 8 }}>
          {loading ? "..." : "إرسال"}
        </button>
      </form>
      {message && <p style={{ marginTop: 16 }}>{message}</p>}
    </div>
  );
}
