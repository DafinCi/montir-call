import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

/**
 * Menganalisis deskripsi masalah dari customer dan mengembalikan AI Pre-Assessment terstruktur
 */
export async function generateAIPreAssessment(problemDescription, vehicleInfo) {
  try {
    const systemPrompt = `
Kamu adalah Sistem Asisten Montir Darurat (AI Pre-Assessment) untuk layanan perbaikan kendaraan di jalan.
Tugasmu adalah menganalisis keluhan customer dan memberikan rekomendasi terstruktur untuk membantu montir mengambil keputusan sebelum menerima pekerjaan.

Kamu WAJIB mengembalikan output dalam format JSON MURNI yang valid (tanpa markdown backticks, tanpa kata 'json') sesuai skema berikut:
{
  "job_summary": "string (Ringkasan masalah customer dalam 1 kalimat pendek)",
  "estimated_issue": "string (Perkiraan sumber masalah/kerusakan teknis utama)",
  "urgency": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "driveable": boolean (true jika kendaraan masih bisa dikendarai/didorong pelan, false jika mogok total),
  "confidence": number (tingkat keyakinan analisis 0.00 - 1.00),
  "recommended_tools": ["string (daftar alat/perkakas yang wajib dibawa)"],
  "recommended_spare_parts": ["string (daftar suku cadang cadangan yang disarankan)"],
  "estimated_duration_minutes": number (perkiraan durasi pengerjaan dalam menit),
  "safety_warning": "string (peringatan keselamatan penting di lokasi kejadian)",
  "recommended_action": "ACCEPT" | "REFER",
  "reasoning": "string (alasan singkat mengapa AI memberikan rekomendasi ini)"
}
`;

    const userPrompt = `
Informasi Kendaraan: ${vehicleInfo || "Kendaraan Bermotor"}
Keluhan Customer: "${problemDescription}"
`;

    const chatCompletion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "openai/gpt-oss-20b",
      response_format: { type: "json_object" },
      temperature: 0.2,
    });

    const responseContent = chatCompletion.choices[0]?.message?.content;
    const aiData = JSON.parse(responseContent || "{}");

    return { success: true, data: aiData };
  } catch (error) {
    console.error("❌ Groq AI Assessment Error:", error);
    // Fallback jika API Groq error agar flow aplikasi tetap berjalan
    return {
      success: false,
      error: error.message,
      data: {
        job_summary: problemDescription,
        estimated_issue: "Perlu pemeriksaan langsung di lokasi",
        urgency: "MEDIUM",
        driveable: false,
        confidence: 0.5,
        recommended_tools: ["Kunci Pas Set", "Obeng Set", "Tang"],
        recommended_spare_parts: [],
        estimated_duration_minutes: 30,
        safety_warning:
          "Tetap berhati-hati saat melakukan perbaikan di pinggir jalan.",
        recommended_action: "ACCEPT",
        reasoning:
          "Gagal memproses AI Pre-Assessment dari Groq. Menggunakan data default.",
      },
    };
  }
}
