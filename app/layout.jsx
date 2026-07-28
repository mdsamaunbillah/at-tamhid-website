import "./globals.css";

export const metadata = {
  title: "At Tamhid Institute — معهد التمهيد",
  description: "دورات ودبلومات في العلوم الإسلامية واللغة العربية",
};

export default function RootLayout({ children }) {
  return (
    <html lang="ar" dir="rtl">
      <body>{children}</body>
    </html>
  );
}
