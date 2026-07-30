import Image from "next/image";
import Link from "next/link";
import { GraduationCap, Sparkles, BookOpen } from "lucide-react";

const teachers = [
  {
    name: "عبد الله المسرور",
    role: "مؤسس المعهد",
    bio: "له فضل تأسيس معهد التمهيد وإرساء رؤيته في نشر العلوم الإسلامية واللغة العربية بأسلوب ميسّر وموثوق.",
    subject: "التوجيه العام والإشراف على رؤية المعهد",
  },
  {
    name: "محمد سماع بالله",
    role: "مدير المعهد",
    bio: "يشرف على إدارة المعهد ومتابعة الدورات والدبلومات، ويعمل على تطوير محتوى المعهد وخدماته باستمرار.",
    subject: "إدارة المعهد ومتابعة الدورات",
  },
  {
    name: "محمود الرحمن أيمن",
    role: "نائب المدير",
    bio: "يساهم في إدارة شؤون المعهد اليومية ومتابعة الطلاب، ويعمل على دعم سير الدورات بسلاسة.",
    subject: "متابعة الطلاب وشؤون المعهد",
  },
];

export default function TeachersPage() {
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
            <Link href="/teachers" className="opacity-100">المدرسون</Link>
            <Link href="/contact" className="opacity-70 hover:opacity-100">تواصل معنا</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm px-4 py-2 rounded-full font-semibold" style={{ background: "#C9A227", color: "#0A1628" }}>
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-6xl mx-auto px-6 pt-16 pb-20">
        <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#9A3324" }}>هيئة التدريس</div>
        <h1 className="text-4xl md:text-5xl mb-14">المدرسون والإداريون</h1>

        <div className="grid md:grid-cols-3 gap-8">
          {teachers.map((t, i) => (
            <div
              key={i}
              className="rounded-2xl p-8 text-center"
              style={{ background: "#F3ECD811", border: "1px solid #C9A22733" }}
            >
              <div
                className="mx-auto mb-5 flex items-center justify-center"
                style={{ width: 84, height: 84, borderRadius: "50%", background: "#C9A22722", border: "2px solid #C9A227" }}
              >
                <GraduationCap size={34} style={{ color: "#C9A227" }} />
              </div>
              <h3 className="text-xl mb-1">{t.name}</h3>
              <div className="text-sm mb-4" style={{ color: "#C9A227" }}>{t.role}</div>
              <p className="text-sm opacity-75 leading-relaxed mb-4">{t.bio}</p>
              <div className="flex items-center justify-center gap-2 text-xs opacity-60">
                <BookOpen size={13} />
                <span>{t.subject}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="px-6 py-10 flex items-center justify-center gap-2" style={{ borderTop: "1px solid #C9A22733" }}>
        <Sparkles size={12} style={{ color: "#C9A227" }} />
        <span className="text-sm opacity-50">معهد التمهيد — دكا، بنغلاديش</span>
      </footer>
    </div>
  );
}
