// lib/certificate.js
import { supabase } from "./supabaseClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function generateCertificateNumber() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `AT-${year}-${random}`;
}

function ensureFontLoaded() {
  if (!document.getElementById("cert-font-link")) {
    const link = document.createElement("link");
    link.id = "cert-font-link";
    link.rel = "stylesheet";
    link.href = "https://fonts.googleapis.com/css2?family=Amiri:wght@400;700&display=swap";
    document.head.appendChild(link);
  }
}

function buildCertificateHTML({ userName, courseTitle, certificateNumber, dateStr }) {
  return `
    <div style="width:1122px;height:794px;background:#0A1628;position:relative;font-family:'Amiri',serif;color:#F3ECD8;box-sizing:border-box;" dir="rtl">
      <div style="position:absolute;inset:22px;border:3px solid #C9A227;border-radius:6px;"></div>
      <div style="position:absolute;inset:34px;border:1px solid #C9A22766;border-radius:4px;"></div>
      <div style="position:relative;text-align:center;padding-top:60px;">
        <img src="${window.location.origin}/logo.jpg" style="width:72px;height:72px;border-radius:10px;margin-bottom:14px;" crossorigin="anonymous" />
        <div style="font-size:26px;letter-spacing:2px;">معهد التمهيد</div>
        <div style="font-size:12px;opacity:0.55;margin-top:4px;letter-spacing:1px;">AT TAMHID INSTITUTE</div>
        <div style="font-size:36px;color:#C9A227;margin-top:36px;font-weight:bold;">شهادة إتمام</div>
        <div style="font-size:15px;opacity:0.75;margin-top:26px;">تشهد إدارة معهد التمهيد بأن الطالب/ة</div>
        <div style="font-size:32px;margin-top:14px;color:#F3ECD8;font-weight:bold;">${userName || "الطالب"}</div>
        <div style="font-size:16px;opacity:0.8;margin-top:22px;">قد أتم بنجاح دورة</div>
        <div style="font-size:23px;color:#C9A227;margin-top:8px;font-weight:bold;">${courseTitle}</div>
      </div>
      <div style="position:absolute;bottom:90px;left:100px;right:100px;display:flex;justify-content:space-between;font-size:14px;">
        <div style="text-align:center;">
          <div style="border-top:1px solid #C9A227aa;width:200px;padding-top:8px;">مؤسس المعهد</div>
          <div style="margin-top:6px;font-weight:bold;">عبد الله المسرور</div>
        </div>
        <div style="text-align:center;">
          <div style="border-top:1px solid #C9A227aa;width:200px;padding-top:8px;">مدير المعهد</div>
          <div style="margin-top:6px;font-weight:bold;">محمد سماع بالله</div>
        </div>
      </div>
      <div style="position:absolute;bottom:26px;left:50px;font-size:11px;opacity:0.5;">رقم الشهادة: ${certificateNumber}</div>
      <div style="position:absolute;bottom:26px;right:50px;font-size:11px;opacity:0.5;">التاريخ: ${dateStr}</div>
    </div>
  `;
}

export async function issueCertificate({ userId, userName, courseId, courseTitle }) {
  const { data: existing } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existing) return existing;

  const certificateNumber = generateCertificateNumber();
  const dateStr = new Date().toLocaleDateString("ar-EG");

  ensureFontLoaded();

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.innerHTML = buildCertificateHTML({ userName, courseTitle, certificateNumber, dateStr });
  document.body.appendChild(container);

  if (document.fonts && document.fonts.ready) {
    await document.fonts.ready;
  }
  await new Promise((resolve) => setTimeout(resolve, 200));

  const canvas = await html2canvas(container.firstElementChild, { scale: 2, useCORS: true });
  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1122, 794] });
  pdf.addImage(imgData, "PNG", 0, 0, 1122, 794);
  const pdfBlob = pdf.output("blob");

  const filePath = `certificates/${certificateNumber}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("certificates")
    .upload(filePath, pdfBlob, { contentType: "application/pdf" });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(filePath);

  const { data, error } = await supabase
    .from("certificates")
    .insert({
      user_id: userId,
      course_id: courseId,
      certificate_number: certificateNumber,
      pdf_url: urlData.publicUrl,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
}
