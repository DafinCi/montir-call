"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchDashboardData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    // 1. Ambil Profil Montir
    let { data: mechanic } = await supabase
      .from("mechanics")
      .select("id, name, status, rating")
      .eq("id", user.id)
      .maybeSingle();

    // SELF-HEALING: Jika baris montir tidak ditemukan di tabel mechanics, buat otomatis
    if (!mechanic) {
      const fallbackName =
        user.user_metadata?.name ||
        user.user_metadata?.full_name ||
        user.email?.split("@")[0] ||
        "Montir";
      const fallbackPhone = user.user_metadata?.phone || "";

      const { data: newMechanic, error: createErr } = await supabase
        .from("mechanics")
        .upsert({
          id: user.id,
          name: fallbackName,
          phone: fallbackPhone,
          status: "OFFLINE",
        })
        .select("id, name, status, rating")
        .single();

      if (!createErr) {
        mechanic = newMechanic;
      }
    }

    // 2. Pekerjaan Aktif (ACCEPTED, ON_THE_WAY, ARRIVED)
    const { data: activeJobs } = await supabase
      .from("service_requests")
      .select("*")
      .eq("assigned_mechanic_id", user.id)
      .in("status", ["ACCEPTED", "ON_THE_WAY", "ARRIVED"])
      .order("created_at", { ascending: false });

    // 3. Waktu Penanda (Batas Rentang Waktu)
    const now = new Date();

    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    );

    const startOfWeek = new Date(startOfDay);
    startOfWeek.setDate(startOfDay.getDate() - startOfDay.getDay());

    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // 4. Pekerjaan Selesai (Diperbaiki: Tambahkan updated_at ke select)
    const { data: completedJobs } = await supabase
      .from("service_requests")
      .select("id, created_at, updated_at, total_fee")
      .eq("assigned_mechanic_id", user.id)
      .eq("status", "COMPLETED");

    // Pre-processing data pesanan selesai
    const processedJobs = (completedJobs || []).map((j) => ({
      ...j,
      fee: Number(j.total_fee || 0),
      // Gunakan updated_at (waktu selesai), fallback ke created_at
      completedAt: new Date(j.updated_at || j.created_at),
    }));

    // --- KALKULASI PENDAPATAN & STATISTIK (Menggunakan processedJobs) ---

    // Total Akumulasi Seluruh Waktu
    const totalRevenue = processedJobs.reduce((acc, j) => acc + j.fee, 0);

    // Hari Ini
    const todayJobs = processedJobs.filter((j) => j.completedAt >= startOfDay);
    const todayRevenue = todayJobs.reduce((acc, j) => acc + j.fee, 0);
    const totalJobsToday = todayJobs.length;

    // Mingguan & Bulanan
    const weeklyRevenue = processedJobs
      .filter((j) => j.completedAt >= startOfWeek)
      .reduce((acc, j) => acc + j.fee, 0);

    const monthlyRevenue = processedJobs
      .filter((j) => j.completedAt >= startOfMonth)
      .reduce((acc, j) => acc + j.fee, 0);

    // 5. Grafik Keuangan (7 Hari Terakhir)
    const daysLabel = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const financialChart = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(startOfDay);
      d.setDate(d.getDate() - (6 - i));

      const dayStart = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const dayEnd = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        23,
        59,
        59,
        999,
      );

      const amount = processedJobs
        .filter((j) => j.completedAt >= dayStart && j.completedAt <= dayEnd)
        .reduce((acc, j) => acc + j.fee, 0);

      return {
        day: daysLabel[d.getDay()],
        amount,
      };
    });

    // 6. Notifikasi / Aktivitas Terbaru
    const { data: recentActivities } = await supabase
      .from("notifications")
      .select("*")
      .eq("mechanic_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      success: true,
      data: {
        mechanicName: mechanic?.name || "Montir",
        mechanicStatus: mechanic?.status || "OFFLINE",
        activeJobs: activeJobs || [],
        stats: {
          totalRevenue,
          todayRevenue,
          totalJobsToday,
          activeJobsCount: activeJobs?.length || 0,
          rating: Number(mechanic?.rating) || 5.0,
          totalReviews: 0,
        },
        financialSummary: {
          total: totalRevenue,
          daily: todayRevenue,
          weekly: weeklyRevenue,
          monthly: monthlyRevenue,
        },
        financialChart,
        recentActivities: recentActivities || [],
      },
    };
  } catch (error) {
    console.error("❌ Error fetchDashboardData:", error);
    return { success: false, error: error.message };
  }
}
