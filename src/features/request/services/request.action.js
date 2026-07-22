"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 1. ACCEPT REQUEST (Anti Race Condition)
 * Menggunakan kriteria `status = 'PENDING'` secara langsung dalam query UPDATE.
 * Jika montir lain sudah mengambil request ini milidetik sebelumnya, query akan mengembalikan 0 row.
 */
export async function acceptRequest(requestId) {
  const supabase = createClient();

  // Ambil ID montir yang sedang terautentikasi
  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();
  if (authErr || !user) {
    return { success: false, error: "Anda harus login terlebih dahulu." };
  }

  // A. Atomic Update Query ke Database
  const { data: request, error: updateErr } = await supabase
    .from("service_requests")
    .update({
      status: "ACCEPTED",
      assigned_mechanic_id: user.id,
    })
    .eq("id", requestId)
    .eq("status", "PENDING") // CRITICAL: Mencegah Race Condition!
    .select()
    .single();

  // B. Jika data gagal di-update / status sudah bukan PENDING lagi
  if (updateErr || !request) {
    return {
      success: false,
      error:
        "Gagal menerima pekerjaan. Order ini sudah diambil oleh montir lain atau dibatalkan.",
    };
  }

  // C. Otomatis ubah status montir menjadi 'BUSY'
  await supabase.from("mechanics").update({ status: "BUSY" }).eq("id", user.id);

  revalidatePath("/dashboard");

  return {
    success: true,
    message: "Pekerjaan berhasil diterima! Selamat bertugas.",
    data: request,
  };
}

/**
 * 2. UPDATE REQUEST STATUS
 * Transisi status pekerjaan: ACCEPTED -> ON_THE_WAY -> ARRIVED -> COMPLETED (atau CANCELLED)
 */
export async function updateRequestStatus(requestId, newStatus) {
  const supabase = createClient();

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

  // Update status pekerjaan (pastikan hanya montir yang di-assign yang bisa update)
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

  // Jika pekerjaan SELESAI atau BATAL, kembalikan status montir menjadi AVAILABLE
  if (newStatus === "COMPLETED" || newStatus === "CANCELLED") {
    await supabase
      .from("mechanics")
      .update({ status: "AVAILABLE" })
      .eq("id", user.id);
  }

  revalidatePath("/dashboard");

  return { success: true, data: request };
}

/**
 * 3. UPDATE MECHANIC LOCATION
 * Di-panggil periodik atau saat pergerakan GPS untuk memperbarui lokasi montir di database
 */
export async function updateMechanicLocation(lat, lng) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const pointWKT = `POINT(${lng} ${lat})`; // Format PostGIS: Lng Lat

  const { error } = await supabase
    .from("mechanics")
    .update({ location: pointWKT })
    .eq("id", user.id);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

/**
 * // Contoh tombol Accept di komponen Frontend UI
import { acceptRequest } from '@/features/requests/services/request.action'

export function AcceptButton({ requestId }) {
  const handleAccept = async () => {
    const response = await acceptRequest(requestId)
    
    if (!response.success) {
      alert(response.error) // Muncul peringatan jika keduluan montir lain
      return
    }

    alert('Berhasil menerima order!')
    // Redirect atau buka tab Navigasi/Maps
  }

  return (
    <button onClick={handleAccept} className="bg-blue-600 text-white p-2 rounded">
      Terima Bantuan
    </button>
  )
}
 */
