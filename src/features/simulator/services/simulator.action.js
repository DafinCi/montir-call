"use server";

import { createClient } from "@/lib/supabase/server";
import { generateAIPreAssessment } from "@/features/ai/services/ai.service";

export async function createSimulatedRequest(formData) {
  const supabase = await createClient();

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

  // Tangkap koordinat dari form (default Monas)
  const lat = formData.latitude || -6.175392;
  const lng = formData.longitude || 106.827153;

  // Format PostGIS WKT POINT(longitude latitude)
  const pointWKT = `POINT(${lng} ${lat})`;

  const problemDesc = formData.problem_description || "Mogok di jalan";
  const vehicleInfo = `${formData.vehicle_type || "Mobil"} ${formData.vehicle_model || "Avanza"}`;

  // AI Analysis
  const aiResponse = await generateAIPreAssessment(problemDesc, vehicleInfo);

  const payload = {
    customer_id: validCustomerId,
    customer_name: formData.customer_name || "Guest Customer",
    customer_phone: formData.customer_phone || "081234567890",
    vehicle_type: formData.vehicle_type || "Mobil",
    vehicle_model: formData.vehicle_model || "Avanza",
    problem_description: problemDesc,
    customer_location: pointWKT,
    status: "PENDING",
    ai_analysis: aiResponse.success ? aiResponse.data : null,
  };

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
