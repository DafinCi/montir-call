"use server";

import { createClient } from "@/lib/supabase/server";
import { generateAIPreAssessment } from "@/features/ai/services/ai.service";

export async function createSimulatedRequest(formData) {
  const supabase = await createClient();

  // Koordinat dummy (Misal: Monas, Jakarta Pusat)
  const dummyLat = -6.175392;
  const dummyLng = 106.827153;
  const pointWKT = `POINT(${dummyLng} ${dummyLat})`;

  const problemDesc = formData.problem_description || "Mogok";
  const vehicleInfo = `${formData.vehicle_type || "Mobil"} ${formData.vehicle_model || "Avanza"}`;

  // 1. Panggil AI Analysis sebelum insert ke database
  const aiResponse = await generateAIPreAssessment(problemDesc, vehicleInfo);

  // 2. Susun Payload
  const payload = {
    customer_name: formData.customer_name || "Guest Customer",
    customer_phone: formData.customer_phone || "081234567890",
    vehicle_type: formData.vehicle_type || "Mobil",
    vehicle_model: formData.vehicle_model || "Avanza",
    problem_description: problemDesc,
    customer_location: pointWKT,
    status: "PENDING",
    // Simpan hasil AI (jika sukses ambil datanya, jika gagal biarkan null)
    ai_analysis: aiResponse.success ? aiResponse.data : null,
  };

  // 3. Insert ke Database
  const { data, error } = await supabase
    .from("service_requests")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("❌ Gagal membuat simulasi pesanan:", error);
    return { success: false, error: error.message };
  }

  return { success: true, data };
}
