import Image from "next/image";
import Link from "next/link";
import { Phone, Mail, MapPin, MessageCircle, Sparkles } from "lucide-react";

export default function ContactPage() {
  return (
    <div dir="rtl" className="min-h-screen w-full" style={{ background: "#0A1628", color: "#F3ECD8" }}>
      <header className="border-b" style={{ borderColor: "#C9A22733" }}>
        <div className="max-w-6xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image src="/logo.jpg" alt="At Tamhid Institute" width={40} height={40} style={{ borderRadius: 8 }} />
            <span className="text-lg tracking-wide">معهد التمهيد</span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm">
            <Link href="/" className="opacity-70 hover:opacity-100">الرئيسية</Link>
            <Link href="/courses" className="opacity-70 hover:opacity-100">الدورات</Link>
            <Link href="/about" className="opacity-70 hover:opacity-100">من نحن</Link>
            <Link href="/teachers" className="opacity-70 hover:opacity-100">المدرسون</Link>
            <Link href="/contact" className="opacity-100">تواصل معنا</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm px-4 py-2 rounded-full font-semibold" style={{ background: "#C9A227", color: "#0A1628" }}>
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-3xl mx-auto px-6 pt-16 pb-24">
        <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#9A3324" }}>تواصل معنا</div>
        <h1 className="text-4xl md:text-5xl mb-6">نحن هنا لمساعدتك</h1>
        <p className="text-base opacity-75 mb-14 max-w-xl">
          لأي استفسار حول الدورات أو التسجيل أو الدفع، يمكنك التواصل معنا عبر الوسائل التالية.
        </p>

        <div className="grid md:grid-cols-2 gap-6">
          <a href="https://wa.me/8801886684922" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 rounded-2xl hover:opacity-90 transition" style={{ background: "#F3ECD811", border: "1px solid #C9A22733" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#C9A22722" }} className="flex items-center justify-center shrink-0">
              <MessageCircle size={20} style={{ color: "#C9A227" }} />
            </div>
            <div>
              <div className="text-xs opacity-60 mb-1">واتساب / اتصال</div>
              <div dir="ltr" className="text-lg font-semibold">+880 1886-684922</div>
            </div>
          </a>

          <a href="https://wa.me/8801822510180" target="_blank" rel="noreferrer" className="flex items-center gap-4 p-6 rounded-2xl hover:opacity-90 transition" style={{ background: "#F3ECD811", border: "1px solid #C9A22733" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#C9A22722" }} className="flex items-center justify-center shrink-0">
              <Phone size={20} style={{ color: "#C9A227" }} />
            </div>
            <div>
              <div className="text-xs opacity-60 mb-1">الدفع / bKash / Nagad</div>
              <div dir="ltr" className="text-lg font-semibold">+880 1822-510180</div>
            </div>
          </a>

          <div className="flex items-center gap-4 p-6 rounded-2xl md:col-span-2" style={{ background: "#F3ECD811", border: "1px solid #C9A22733" }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: "#C9A22722" }} className="flex items-center justify-center shrink-0">
              <MapPin size={20} style={{ color: "#C9A227" }} />
            </div>
            <div>
              <div className="text-xs opacity-60 mb-1">الموقع</div>
              <div className="text-lg font-semibold">دكا، بنغلاديش</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 flex items-center justify-center gap-2" style={{ borderTop: "1px solid #C9A22733" }}>
        <Sparkles size={12} style={{ color: "#C9A227" }} />
        <span className="text-sm opacity-50">معهد التمهيد — دكا، بنغلاديش</span>
      </footer>
    </div>
  );
}
