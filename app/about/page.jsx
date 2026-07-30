import Link from "next/link";
import Image from "next/image";
import { GraduationCap, ArrowLeft, Sparkles, BookOpen, Users, Award } from "lucide-react";

export default function AboutPage() {
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
            <Link href="/about" className="opacity-100">من نحن</Link>
            <Link href="/teachers" className="opacity-70 hover:opacity-100">المدرسون</Link>
            <Link href="/contact" className="opacity-70 hover:opacity-100">تواصل معنا</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="text-sm px-4 py-2 rounded-full font-semibold" style={{ background: "#C9A227", color: "#0A1628" }}>
              تسجيل الدخول
            </Link>
          </div>
        </div>
      </header>

      <section className="max-w-4xl mx-auto px-6 pt-16 pb-10">
        <div className="text-xs tracking-[0.2em] uppercase mb-4" style={{ color: "#9A3324" }}>من نحن</div>
        <h1 className="text-4xl md:text-5xl mb-8">معهد التمهيد للدراسات الإسلامية واللغوية</h1>
        <p className="text-lg leading-relaxed opacity-80 mb-6">
          يسعى معهد التمهيد إلى فتح أبواب العلم الشرعي واللغة العربية أمام كل راغب في التعلم، عبر دورات ودبلومات
          ميسّرة تجمع بين الأصالة العلمية والسند المتصل، سواء كانت مجانية بشهادة فورية أو بإشراف مباشر من المدرسين.
        </p>
        <p className="text-lg leading-relaxed opacity-80 mb-16">
          نؤمن بأن طلب العلم حق للجميع، ونعمل على تقديم محتوى موثوق في التجويد والفقه والعقيدة والنحو والصرف
          وغيرها من العلوم الإسلامية واللغوية، مع متابعة دقيقة لتقدّم كل طالب حتى إتمام الدورة.
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-2xl" style={{ background: "#F3ECD811", border: "1px solid #C9A22733" }}>
            <BookOpen size={26} style={{ color: "#C9A227" }} className="mb-3" />
            <h3 className="text-lg mb-2">علوم أصيلة</h3>
            <p className="text-sm opacity-70">مناهج مبنية على السند والدقة العلمية</p>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: "#F3ECD811", border: "1px solid #C9A22733" }}>
            <Users size={26} style={{ color: "#C9A227" }} className="mb-3" />
            <h3 className="text-lg mb-2">إشراف مباشر</h3>
            <p className="text-sm opacity-70">متابعة شخصية لتقدم كل طالب</p>
          </div>
          <div className="p-6 rounded-2xl" style={{ background: "#F3ECD811", border: "1px solid #C9A22733" }}>
            <Award size={26} style={{ color: "#C9A227" }} className="mb-3" />
            <h3 className="text-lg mb-2">شهادات معتمدة</h3>
            <p className="text-sm opacity-70">شهادة إتمام فور إنهاء الدورة</p>
          </div>
        </div>
      </section>

      <section style={{ background: "#F3ECD8", color: "#0A1628" }}>
        <div className="max-w-4xl mx-auto px-6 py-16">
          <div className="text-xs tracking-[0.2em] uppercase mb-2" style={{ color: "#9A3324" }}>هيئة الإدارة</div>
          <h2 className="text-3xl mb-10">القائمون على المعهد</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 rounded-2xl border" style={{ borderColor: "#0A162822" }}>
              <GraduationCap size={30} style={{ color: "#9A3324" }} className="mx-auto mb-3" />
              <div className="text-xs opacity-60 mb-1">مؤسس المعهد</div>
              <div className="text-lg font-bold">عبد الله المسرور</div>
            </div>
            <div className="text-center p-6 rounded-2xl border" style={{ borderColor: "#0A162822" }}>
              <GraduationCap size={30} style={{ color: "#9A3324" }} className="mx-auto mb-3" />
              <div className="text-xs opacity-60 mb-1">مدير المعهد</div>
              <div className="text-lg font-bold">محمد سماع بالله</div>
            </div>
            <div className="text-center p-6 rounded-2xl border" style={{ borderColor: "#0A162822" }}>
              <GraduationCap size={30} style={{ color: "#9A3324" }} className="mx-auto mb-3" />
              <div className="text-xs opacity-60 mb-1">نائب المدير</div>
              <div className="text-lg font-bold">محمود الرحمن أيمن</div>
            </div>
          </div>
        </div>
      </section>

      <footer className="px-6 py-10 flex items-center justify-center gap-2">
        <Sparkles size={12} style={{ color: "#C9A227" }} />
        <span className="text-sm opacity-50">معهد التمهيد — دكا، بنغلاديش</span>
      </footer>
    </div>
  );
}
