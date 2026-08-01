// lib/certificate.js
import { supabase } from "./supabaseClient";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function generateCertificateNumber() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return "AT-" + year + "-" + random;
}

function maskedText(top, left, width, text, rtl, size) {
  const dirAttr = rtl ? ' dir="rtl"' : "";
  return (
    '<div' + dirAttr + ' style="position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + width + 'px;height:34px;background:#F7F1E1;"></div>' +
    '<div' + dirAttr + ' style="position:absolute;top:' + top + 'px;left:' + left + 'px;width:' + width + 'px;text-align:center;font-size:' + size + 'px;color:#0A1628;font-weight:bold;line-height:34px;">' + text + '</div>'
  );
}

function buildCertificateHTML(data) {
  const userName = data.userName || "Student";
  const courseTitle = data.courseTitle || "";
  const certNumber = data.certNumber;
  const dateStr = data.dateStr;
  const origin = window.location.origin;

  let html = '<div style="position:relative;width:1536px;height:1024px;font-family:Arial,sans-serif;">';

  html += '<img id="cert-bg-img" src="' + origin + '/certificate-template.jpg.png" style="position:absolute;top:0;left:0;width:1536px;height:1024px;display:block;" crossorigin="anonymous" />';

  // English name & course
  html += maskedText(398, 95, 440, userName, false, 24);
  html += maskedText(480, 95, 440, courseTitle, false, 20);

  // Arabic name & course
  html += maskedText(398, 1000, 420, userName, true, 24);
  html += maskedText(480, 1000, 420, courseTitle, true, 20);

  // Date of completion (English) + duration left blank
  html += maskedText(748, 148, 160, dateStr, false, 13);

  // Certificate ID
  html += maskedText(853, 685, 170, certNumber, false, 11);

  // Date (Arabic side)
  html += maskedText(748, 1285, 160, dateStr, true, 13);

  html += "</div>";
  return html;
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

  const bgImg = container.querySelector("#cert-bg-img");
  await new Promise(function (resolve) {
    if (bgImg.complete && bgImg.naturalWidth > 0) {
      resolve();
    } else {
      bgImg.onload = resolve;
      bgImg.onerror = resolve;
    }
  });

  await new Promise(function (resolve) {
    setTimeout(resolve, 200);
  });

  const canvas = await html2canvas(container.firstElementChild, {
    scale: 2,
    useCORS: true,
    allowTaint: true,
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
