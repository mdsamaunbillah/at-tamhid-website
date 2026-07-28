"use client";
import { useEffect, useState } from "react";
import { supabase } from "../../../lib/supabaseClient";

// Route: app/admin/payments/page.jsx
// শুধু role = 'admin' হলে এই পেজ কাজ করবে

export default function AdminPaymentsPage() {
  const [isAdmin, setIsAdmin] = useState(false);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const { data: userData } = await supabase.auth.getUser();
      if (!userData?.user) {
        setLoading(false);
        return;
      }

      const { data: profile } = await supabase.from("profiles").select("role").eq("id", userData.user.id).single();

      if (profile?.role !== "admin") {
        setLoading(false);
        return;
      }
      setIsAdmin(true);

      const { data: paymentsData } = await supabase
        .from("payments")
        .select("*, profiles(full_name, email), courses(title_ar, price)")
        .eq("status", "pending")
        .order("submitted_at", { ascending: false });

      setPayments(paymentsData || []);
      setLoading(false);
    }
    load();
  }, []);

  async function handleDecision(payment, decision) {
    const { data: userData } = await supabase.auth.getUser();

    await supabase
      .from("payments")
      .update({
        status: decision,
        verified_by: userData.user.id,
        verified_at: new Date().toISOString(),
      })
      .eq("id", payment.id);

    if (decision === "approved") {
      await supabase
        .from("enrollments")
        .update({ status: "active" })
        .eq("user_id", payment.user_id)
        .eq("course_id", payment.course_id);
    }

    setPayments((prev) => prev.filter((p) => p.id !== payment.id));
  }

  if (loading) return <p style={{ textAlign: "center", marginTop: 60 }}>جاري التحميل...</p>;
  if (!isAdmin) return <p style={{ textAlign: "center", marginTop: 60 }}>هذه الصفحة للمشرفين فقط.</p>;

  return (
    <div dir="rtl" style={{ maxWidth: 800, margin: "40px auto", fontFamily: "sans-serif" }}>
      <h1>طلبات الدفع المعلقة</h1>
      {payments.length === 0 && <p>لا توجد طلبات معلقة حالياً.</p>}

      {payments.map((p) => (
        <div key={p.id} style={{ border: "1px solid #ddd", borderRadius: 12, padding: 16, marginBottom: 12 }}>
          <p><strong>الطالب:</strong> {p.profiles?.full_name} ({p.profiles?.email})</p>
          <p><strong>الدورة:</strong> {p.courses?.title_ar} — {p.courses?.price} ৳</p>
          <p><strong>طريقة الدفع:</strong> {p.method === "bkash" ? "bKash" : "Nagad"}</p>
          <p><strong>رقم العملية:</strong> {p.transaction_id}</p>
          <p><strong>رقم المرسل:</strong> {p.sender_number}</p>
          <p style={{ fontSize: 12, opacity: 0.6 }}>
            تاريخ الإرسال: {new Date(p.submitted_at).toLocaleString()}
          </p>
          <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
            <button
              onClick={() => handleDecision(p, "approved")}
              style={{ padding: "8px 20px", borderRadius: 20, background: "#1F4D3E", color: "#fff", border: "none" }}
            >
              قبول ✅
            </button>
            <button
              onClick={() => handleDecision(p, "rejected")}
              style={{ padding: "8px 20px", borderRadius: 20, background: "#9A3324", color: "#fff", border: "none" }}
            >
              رفض ❌
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
