"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { generateAIPreAssessment } from "@/features/ai/services/ai.service";

export async function createSimulatedRequest(formData) {
  const supabase = await createClient();

  // 1. Verifikasi Sesi Pengguna
  const {
    data: { user },
  } = await supabase.auth.getUser();

  let validCustomerId = null;

  if (user?.id) {
    const { data: customer } = await supabase
      .from("customers")
      .select("id")
      .eq("id", user.id)
      .maybeSingle();

    if (customer) {
      validCustomerId = customer.id;
    }
  }

  // 2. Sanitasi & Parsing Koordinat GPS (Default Monas)
  const lat = parseFloat(formData.latitude) || -6.175392;
  const lng = parseFloat(formData.longitude) || 106.827153;

  // Format PostGIS WKT POINT(longitude latitude)
  const pointWKT = `POINT(${lng} ${lat})`;

  const problemDesc = formData.problem_description || "Mogok di jalan";
  const vehicleInfo = `${formData.vehicle_type || "Mobil"} ${formData.vehicle_model || "Avanza"}`;
  const addressText = formData.address || "Lokasi Pelanggan (GPS)";

  // 3. AI Analysis dengan Try-Catch
  let aiData = null;
  try {
    const aiResponse = await generateAIPreAssessment(problemDesc, vehicleInfo);
    if (aiResponse?.success) {
      aiData = aiResponse.data;
    }
  } catch (aiErr) {
    console.warn("⚠️ AI Pre-Assessment gagal, melanjutkan tanpa AI:", aiErr);
  }

  // 4. Payload disesuaikan persis dengan skema tabel service_requests
  const payload = {
    customer_id: validCustomerId,
    customer_name: formData.customer_name || "Guest Customer",
    customer_phone: formData.customer_phone || "081234567890",
    vehicle_type: formData.vehicle_type || "Mobil",
    vehicle_model: formData.vehicle_model || "Avanza",
    problem_description: problemDesc,
    customer_location: pointWKT,
    location_address: addressText, // Sesuai kolom di Supabase kamu!
    status: "PENDING",
    ai_analysis: aiData,
  };

  // 5. Insert Data ke Supabase
  const { data, error } = await supabase
    .from("service_requests")
    .insert([payload])
    .select()
    .single();

  if (error) {
    console.error("❌ Gagal membuat simulasi pesanan:", error);
    return { success: false, error: error.message };
  }

  revalidatePath("/dashboard");
  revalidatePath("/request");

  return { success: true, data };
}