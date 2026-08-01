// lib/certificate.js
import { supabase } from "./supabaseClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function generateCertificateNumber() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return "AT-" + year + "-" + random;
}

function buildCertificateHTML(data) {
  const userName = data.userName || "Student";
  const courseTitle = data.courseTitle || "";
  const certNumber = data.certNumber;
  const dateStr = data.dateStr;

  return (
    '<div style="position:relative;width:1536px;height:1024px;background-image:url(' +
    window.location.origin +
    '/certificate-template.jpg);background-size:cover;font-family:Arial,sans-serif;">' +

    // English student name
    '<div style="position:absolute;top:410px;left:100px;width:430px;text-align:center;font-size:26px;color:#0A1628;font-weight:bold;">' + userName + '</div>' +

    // English course name
    '<div style="position:absolute;top:495px;left:100px;width:430px;text-align:center;font-size:22px;color:#0A1628;font-weight:bold;">' + courseTitle + '</div>' +

    // English date of completion
    '<div style="position:absolute;top:748px;left:150px;width:160px;text-align:left;font-size:14px;color:#0A1628;">' + dateStr + '</div>' +

    // English certificate ID
    '<div style="position:absolute;top:855px;left:685px;width:170px;text-align:center;font-size:12px;color:#0A1628;">' + certNumber + '</div>' +

    // Arabic student name
    '<div dir="rtl" style="position:absolute;top:410px;left:1010px;width:400px;text-align:center;font-size:26px;color:#0A1628;font-weight:bold;">' + userName + '</div>' +

    // Arabic course name
    '<div dir="rtl" style="position:absolute;top:495px;left:1010px;width:400px;text-align:center;font-size:22px;color:#0A1628;font-weight:bold;">' + courseTitle + '</div>' +

    // Arabic date
    '<div dir="rtl" style="position:absolute;top:748px;left:1290px;width:160px;text-align:center;font-size:14px;color:#0A1628;">' + dateStr + '</div>' +

    '</div>'
  );
}

export async function issueCertificate(params) {
  const userId = params.userId;
  const userName = params.userName;
  const courseId = params.courseId;
  const courseTitle = params.courseTitle;

  const existingResult = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existingResult.data) return existingResult.data;

  const certNumber = generateCertificateNumber();
  const dateStr = new Date().toLocaleDateString("ar-EG");

  const container = document.createElement("div");
  container.style.position = "fixed";
  container.style.top = "-9999px";
  container.style.left = "-9999px";
  container.innerHTML = buildCertificateHTML({
    userName: userName,
    courseTitle: courseTitle,
    certNumber: certNumber,
    dateStr: dateStr,
  });
  document.body.appendChild(container);

  await new Promise(function (resolve) {
    setTimeout(resolve, 300);
  });

  const canvas = await html2canvas(container.firstElementChild, {
    scale: 2,
    useCORS: true,
  });
  document.body.removeChild(container);

  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: [1536, 1024] });
  pdf.addImage(imgData, "PNG", 0, 0, 1536, 1024);
  const pdfBlob = pdf.output("blob");

  const filePath = "certificates/" + certNumber + ".pdf";
  const uploadResult = await supabase.storage
    .from("certificates")
    .upload(filePath, pdfBlob, { contentType: "application/pdf" });

  if (uploadResult.error) throw uploadResult.error;

  const urlResult = supabase.storage.from("certificates").getPublicUrl(filePath);

  const insertResult = await supabase
    .from("certificates")
    .insert({
      user_id: userId,
      course_id: courseId,
      certificate_number: certNumber,
      pdf_url: urlResult.data.publicUrl,
    })
    .select()
    .single();

  if (insertResult.error) throw insertResult.error;
  return insertResult.data;
}
