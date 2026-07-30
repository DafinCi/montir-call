import Groq from "groq-sdk";

const MECHANIC_SYSTEM_INSTRUCTION = `
Kamu adalah "Montir Pro AI", seorang Master Mekanik / Pakar Otomotif Senior Indonesia yang sangat berpengalaman menangani sepeda motor dan mobil (bensin, diesel, hingga listrik/EV).

Tugas utama kamu adalah membantu para montir lapangan menyelesaikan masalah teknis perbaikan kendaraan.

Panduan Jawaban:
1. GAYA BAHASA: Gunakan bahasa Indonesia yang santai tapi profesional, akrab dengan istilah umum perbengkelan Indonesia (seperti: mbrebet, skir klep, top kompresi, aus, seal bocor, aki drop, DTC, dll).
2. TEPAT & RINGKAS: Montir di lapangan tidak punya waktu baca artikel panjang. Berikan poin-poin diagnosa yang to-the-point.
3. STRUKTUR JAWABAN:
   - Diagnosa Singkat (kemungkinan utama masalah).
   - Langkah Inspeksi / Trouble Shooting (urutkan dari yang termudah/termurah untuk diperiksa).
   - Solusi / Momen Pengencangan / Estimasi Komponen jika relevan.
4. KODE DTC/OBD-II: Jika montir memberikan kode error (misal P0300, P0113), jelaskan arti kode tersebut dan komponen terkait.
5. KESELAMATAN: Ingatkan poin keselamatan penting jika menangani bagian berisiko (misal: tegangan tinggi kelistrikan, dongkrak, sistem rem, atau cairan panas).
`;

export async function askMechanicAI(history = [], newMessage) {
  const apiKey = process.env.GROQ_API_KEY;

  if (!apiKey) {
    console.error("GROQ_API_KEY tidak ditemukan di environment variables!");
    return {
      success: false,
      error: "Konfigurasi GROQ_API_KEY belum terpasang di server.",
    };
  }

  try {
    const groq = new Groq({ apiKey });
    const messages = [
      { role: "system", content: MECHANIC_SYSTEM_INSTRUCTION },
      ...history.map((msg) => ({
        role:
          msg.role === "assistant" || msg.role === "model"
            ? "assistant"
            : "user",
        content: msg.content || msg.text || "",
      })),
      { role: "user", content: newMessage },
    ];

    const chatCompletion = await groq.chat.completions.create({
      messages: messages,
      model: "llama-3.3-70b-versatile",
      temperature: 0.4,
      max_tokens: 1000,
    });

    const answerText = chatCompletion.choices[0]?.message?.content || "";

    return {
      success: true,
      data: answerText,
    };
  } catch (error) {
    console.error("Groq QnA Error:", error);
    return {
      success: false,
      error: error.message || "Gagal mendapatkan respon dari AI Montir.",
    };
  }
}
