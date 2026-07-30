"use server";

import { askMechanicAI } from "../services/ai.service";

/**
 * @param {Object} payload
 * @param {Array} payload.history
 * @param {string} payload.message
 */
export async function sendMechanicQuery({ history = [], message }) {
  //Validasi Input
  if (!message || typeof message !== "string" || !message.trim()) {
    return {
      success: false,
      error: "Pesan tidak boleh kosong.",
    };
  }

  try {
    const result = await askMechanicAI(history, message.trim());

    if (!result.success) {
      return {
        success: false,
        error: result.error,
      };
    }

    return {
      success: true,
      answer: result.data,
    };
  } catch (error) {
    console.error("Error pada sendMechanicQuery Action:", error);
    return {
      success: false,
      error: "Terjadi kesalahan pada server saat memproses pertanyaan.",
    };
  }
}
