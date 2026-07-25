"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Helper untuk format waktu relatif (misal: "5 menit lalu")
 */
function formatRelativeTime(dateString) {
  if (!dateString) return "Baru saja";
  const date = new Date(dateString);
  const now = new Date();
  const diffInMinutes = Math.floor((now - date) / (1000 * 60));

  if (diffInMinutes < 1) return "Baru saja";
  if (diffInMinutes < 60) return `${diffInMinutes} menit lalu`;
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) return `${diffInHours} jam lalu`;
  return date.toLocaleDateString("id-ID", { day: "numeric", month: "short" });
}

/**
 * 1. GET PENDING REQUESTS
 * Mengambil semua pesanan masuk yang belum diambil montir lain (status = 'PENDING')
 */
export async function getPendingRequests() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized", data: [] };
  }

  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("status", "PENDING")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching pending requests:", error);
    return { success: false, error: error.message, data: [] };
  }

  // Format data DB agar sesuai dengan kebutuhan UI Component
  const formattedData = (data || []).map((item) => ({
    id: item.id,
    customerName: item.customer_name || item.user_name || "Pelanggan",
    createdAt: formatRelativeTime(item.created_at),
    priority: item.priority || (item.is_emergency ? "emergency" : "scheduled"),
    vehicleModel:
      item.vehicle_model || item.vehicle_type || "Kendaraan Pelanggan",
    licensePlate: item.license_plate || item.vehicle_plate || "-",
    problemDescription:
      item.problem_description ||
      item.description ||
      "Tidak ada rincian keluhan.",
    symptoms: Array.isArray(item.symptoms)
      ? item.symptoms
      : typeof item.symptoms === "string"
        ? JSON.parse(item.symptoms || "[]")
        : [],
    locationTitle: item.location_title || item.place_name || "Lokasi Pelanggan",
    locationAddress:
      item.location_address || item.address || "Alamat lokasi tidak tersedia",
    distanceKm: item.distance_km ? String(item.distance_km) : "2.5",
    estimatedTime: item.estimated_time || "10 min",
    customerNote: item.customer_note || item.notes || "",
  }));

  return { success: true, data: formattedData };
}

/**
 * 2. ACCEPT REQUEST (Anti Race Condition)
 */
export async function acceptRequest(requestId) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return { success: false, error: "Anda harus login terlebih dahulu." };
  }

  // Atomic Update Query
  const { data: request, error: updateErr } = await supabase
    .from("service_requests")
    .update({
      status: "ACCEPTED",
      assigned_mechanic_id: user.id,
    })
    .eq("id", requestId)
    .eq("status", "PENDING") // Mencegah Race Condition!
    .select()
    .single();

  if (updateErr || !request) {
    return {
      success: false,
      error:
        "Gagal menerima pekerjaan. Order ini sudah diambil oleh montir lain atau dibatalkan.",
    };
  }

  // Ubah status montir menjadi BUSY
  await supabase.from("mechanics").update({ status: "BUSY" }).eq("id", user.id);

  revalidatePath("/dashboard");
  revalidatePath("/request");

  return {
    success: true,
    message: "Pekerjaan berhasil diterima! Selamat bertugas.",
    data: request,
  };
}

/**
 * 3. UPDATE REQUEST STATUS
 */
export async function updateRequestStatus(requestId, newStatus) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return { success: false, error: "Sesi anda telah berakhir." };
  }

  const validStatuses = ["ON_THE_WAY", "ARRIVED", "COMPLETED", "CANCELLED"];
  if (!validStatuses.includes(newStatus)) {
    return { success: false, error: "Status pekerjaan tidak valid." };
  }

  const { data: request, error } = await supabase
    .from("service_requests")
    .update({ status: newStatus })
    .eq("id", requestId)
    .eq("assigned_mechanic_id", user.id)
    .select()
    .single();

  if (error || !request) {
    return { success: false, error: "Gagal memperbarui status pekerjaan." };
  }

  if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
    await supabase
      .from("mechanics")
      .update({ status: "AVAILABLE" })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");
  revalidatePath("/request");

  return { success: true, data: request };
}

/**
 * 4. UPDATE MECHANIC LOCATION
 */
export async function updateMechanicLocation(lat, lng) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { success: false, error: "Unauthorized" };

  const pointWKT = `POINT(${lng} ${lat})`;

  const { error } = await supabase
    .from("mechanics")
    .update({ location: pointWKT })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}
