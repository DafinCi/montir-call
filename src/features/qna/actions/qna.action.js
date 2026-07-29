"use server";

import { askMechanicAI } from "../services/ai.service";

/**
 * Server Action untuk memproses pertanyaan montir
 * @param {Object} payload
 * @param {Array} payload.history - Array riwayat percakapan sebelumnya
 * @param {string} payload.message - Pertanyaan terbaru montir
 */
export async function sendMechanicQuery({ history = [], message }) {
  // 1. Validasi Input
  if (!message || typeof message !== "string" || !message.trim()) {
    return {
      success: false,
      error: "Pesan tidak boleh kosong.",
    };
  }

  try {
    // 2. Panggil AI Service
    const result = await askMechanicAI(history, message.trim());

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    // 3. Kembalikan data jawaban
    return {
      success: true,
      answer: result.data,
    };
  } catch (error) {
    console.error("❌ Error pada sendMechanicQuery Action:", error);
    return {
      success: false,
      error: "Terjadi kesalahan pada server saat memproses pertanyaan.",
    };
  }
}
