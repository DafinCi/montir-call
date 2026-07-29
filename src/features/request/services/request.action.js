"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * Helper untuk format waktu relatif (misal: "5 menit lalu")
 */
function formatRelativeTime(dateString) {
  if (!dateString) return "Baru saja";
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return "Baru saja";

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
    console.error("❌ Error fetching pending requests:", error);
    return { success: false, error: error.message, data: [] };
  }

  // Format data DB agar sesuai dengan kebutuhan UI Component
  const formattedData = (data || []).map((item) => {
    // Normalisasi Flag Emergency secara komprehensif
    const isEmergency =
      item.is_emergency === true ||
      item.isEmergency === true ||
      String(item.priority || "").toLowerCase() === "emergency" ||
      String(item.priority || "").toLowerCase() === "critical" ||
      String(item.ai_analysis?.urgency || "").toUpperCase() === "CRITICAL" ||
      String(item.service_type || "").toLowerCase() === "emergency";

    const normalizedPriority = isEmergency ? "emergency" : "scheduled";

    return {
      ...item,
      id: item.id,
      customerName: item.customer_name || item.user_name || "Pelanggan",
      customerPhone: item.customer_phone || item.phone || "",
      createdAt: formatRelativeTime(item.created_at),
      priority: normalizedPriority,
      isEmergency: isEmergency,
      vehicleModel:
        item.vehicle_model || item.vehicle_type || "Kendaraan Pelanggan",
      licensePlate: item.license_plate || item.vehicle_plate || "-",
      problemDescription:
        item.problem_description ||
        item.description ||
        "Tidak ada rincian keluhan.",
      aiAnalysis: item.ai_analysis || null,
      customerLocation: item.customer_location,
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
    };
  });

  return { success: true, data: formattedData };
}

/**
 * 2. ACCEPT REQUEST (Anti Race Condition + Auto Notification)
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

  // Atomic Update Query Mencegah Race Condition
  const { data: request, error: updateErr } = await supabase
    .from("service_requests")
    .update({
      status: "ACCEPTED",
      assigned_mechanic_id: user.id,
      updated_at: new Date().toISOString(),
    })
    .eq("id", requestId)
    .eq("status", "PENDING")
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

  // Buat notifikasi riwayat aktivitas
  await supabase.from("notifications").insert([
    {
      mechanic_id: user.id,
      title: "Pekerjaan Diterima 🚗",
      message: `Anda mengambil pesanan perbaikan dari ${request.customer_name || "Pelanggan"}.`,
      created_at: new Date().toISOString(),
    },
  ]);

  revalidatePath("/dashboard");
  revalidatePath("/request");

  return {
    success: true,
    message: "Pekerjaan berhasil diterima! Selamat bertugas.",
    data: request,
  };
}

/**
 * 3. UPDATE REQUEST STATUS & PAYMENT (Auto Income & Notification Integration)
 */
export async function updateRequestStatus(
  requestId,
  newStatus,
  additionalData = {},
) {
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

  // Siapkan payload update
  const updatePayload = {
    status: newStatus,
    updated_at: new Date().toISOString(),
  };

  // Jika status COMPLETED, olah nominal biaya
  if (newStatus === "COMPLETED") {
    const rawFee = additionalData?.totalFee ?? additionalData?.total_fee;

    if (rawFee !== undefined && rawFee !== null && rawFee !== "") {
      const numericFee =
        typeof rawFee === "string"
          ? Number(rawFee.replace(/[^0-9]/g, ""))
          : Number(rawFee);

      if (!isNaN(numericFee) && numericFee > 0) {
        updatePayload.total_fee = numericFee;
      }
    }
  }

  const { data: request, error } = await supabase
    .from("service_requests")
    .update(updatePayload)
    .eq("id", requestId)
    .eq("assigned_mechanic_id", user.id)
    .select()
    .single();

  if (error || !request) {
    console.error("❌ Error update status service_request:", error?.message);
    return { success: false, error: "Gagal memperbarui status pekerjaan." };
  }

  // Jika Selesai atau Dibatalkan, kembalikan status montir ke AVAILABLE
  if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
    await supabase
      .from("mechanics")
      .update({ status: "AVAILABLE" })
      .eq("id", user.id);
  }

  // CATAT AKTIVITAS KE TABEL NOTIFIKASI
  try {
    let notifTitle = "";
    let notifMessage = "";

    if (newStatus === "ON_THE_WAY") {
      notifTitle = "Dalam Perjalanan 🧭";
      notifMessage = `Menuju ke lokasi ${request.customer_name || "Pelanggan"}.`;
    } else if (newStatus === "ARRIVED") {
      notifTitle = "Sampai di Lokasi 📍";
      notifMessage = `Tiba di lokasi perbaikan (${request.vehicle_model || "Kendaraan"}).`;
    } else if (newStatus === "COMPLETED") {
      const formattedFee = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        maximumFractionDigits: 0,
      }).format(updatePayload.total_fee || 0);

      notifTitle = "Pembayaran Diterima 💰";
      notifMessage = `Servis selesai! Tagihan ${formattedFee} berhasil masuk ke saldo pendapatan.`;
    } else if (newStatus === "CANCELLED") {
      notifTitle = "Pekerjaan Dibatalkan ❌";
      notifMessage = `Pesanan dari ${request.customer_name || "Pelanggan"} telah dibatalkan.`;
    }

    if (notifTitle) {
      await supabase.from("notifications").insert([
        {
          mechanic_id: user.id,
          title: notifTitle,
          message: notifMessage,
          created_at: new Date().toISOString(),
        },
      ]);
    }
  } catch (notifErr) {
    console.error("⚠️ Gagal membuat notifikasi:", notifErr);
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