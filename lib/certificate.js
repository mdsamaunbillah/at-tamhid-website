// lib/certificate.js
// ফ্রি কোর্স সম্পন্ন হলে এই ফাংশন কল করলে অটোমেটিক PDF সার্টিফিকেট তৈরি হয়ে
// Supabase Storage-এ আপলোড হবে, আর certificates টেবিলে একটা রেকর্ড তৈরি হবে।
//
// ব্যবহার: dashboard পেজে যখন কোনো ইউজারের progress = 100% হয়, তখন এই ফাংশন কল করতে হবে।

import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { supabase } from "./supabaseClient";

function generateCertificateNumber() {
  const random = Math.random().toString(36).substring(2, 8).toUpperCase();
  const year = new Date().getFullYear();
  return `AT-${year}-${random}`;
}

export async function issueCertificate({ userId, userName, courseId, courseTitle }) {
  // ১. একই কোর্সের জন্য আগে থেকে সার্টিফিকেট থাকলে দ্বিতীয়বার বানাবে না
  const { data: existing } = await supabase
    .from("certificates")
    .select("id")
    .eq("user_id", userId)
    .eq("course_id", courseId)
    .single();

  if (existing) return existing;

  const certificateNumber = generateCertificateNumber();

  // ২. PDF তৈরি করা
  const pdfDoc = await PDFDocument.create();
  const page = pdfDoc.addPage([842, 595]); // A4 landscape
  const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  const fontRegular = await pdfDoc.embedFont(StandardFonts.Helvetica);

  const navy = rgb(0.04, 0.09, 0.16);
  const gold = rgb(0.79, 0.64, 0.19);

  // বর্ডার
  page.drawRectangle({
    x: 20,
    y: 20,
    width: 802,
    height: 555,
    borderColor: gold,
    borderWidth: 3,
  });

  page.drawText("At Tamhid Institute", {
    x: 300,
    y: 480,
    size: 22,
    font,
    color: navy,
  });

  page.drawText("Certificate of Completion", {
    x: 260,
    y: 430,
    size: 28,
    font,
    color: gold,
  });

  page.drawText("This certifies that", {
    x: 350,
    y: 370,
    size: 14,
    font: fontRegular,
    color: navy,
  });

  page.drawText(userName || "Student", {
    x: 300,
    y: 335,
    size: 24,
    font,
    color: navy,
  });

  page.drawText(`has successfully completed the course: ${courseTitle}`, {
    x: 180,
    y: 290,
    size: 14,
    font: fontRegular,
    color: navy,
  });

  page.drawText(`Certificate No: ${certificateNumber}`, {
    x: 60,
    y: 60,
    size: 10,
    font: fontRegular,
    color: navy,
  });

  page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
    x: 650,
    y: 60,
    size: 10,
    font: fontRegular,
    color: navy,
  });

  const pdfBytes = await pdfDoc.save();

  // ৩. Supabase Storage-এ আপলোড
  const filePath = `certificates/${certificateNumber}.pdf`;
  const { error: uploadError } = await supabase.storage
    .from("certificates")
    .upload(filePath, pdfBytes, { contentType: "application/pdf" });

  if (uploadError) throw uploadError;

  const { data: urlData } = supabase.storage.from("certificates").getPublicUrl(filePath);

  // ৪. certificates টেবিলে রেকর্ড তৈরি
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
