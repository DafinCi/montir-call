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
    // 1. Profil Montir
    const { data: mechanic } = await supabase
      .from("mechanics")
      .select("*")
      .eq("id", user.id)
      .single();

    // 2. Pekerjaan Aktif (ACCEPTED, ON_THE_WAY, ARRIVED)
    const { data: activeJobs } = await supabase
      .from("service_requests")
      .select("*")
      .eq("assigned_mechanic_id", user.id)
      .in("status", ["ACCEPTED", "ON_THE_WAY", "ARRIVED"])
      .order("created_at", { ascending: false });

    // 3. Waktu Penanda (Hari Ini, Minggu Ini, Bulan Ini)
    const now = new Date();
    const startOfDay = new Date(
      now.getFullYear(),
      now.getMonth(),
      now.getDate(),
    ).toISOString();

    const startOfWeek = new Date(now);
    startOfWeek.setDate(now.getDate() - now.getDay());
    startOfWeek.setHours(0, 0, 0, 0);

    const startOfMonth = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    ).toISOString();

    // 4. Ambil Pekerjaan Selesai (COMPLETED)
    const { data: completedJobs } = await supabase
      .from("service_requests")
      .select("id, total_fee, created_at")
      .eq("assigned_mechanic_id", user.id)
      .eq("status", "COMPLETED");

    const jobs = completedJobs || [];

    // Kalkulasi Ringkasan Keuangan
    const todayRevenue = jobs
      .filter((j) => new Date(j.created_at) >= new Date(startOfDay))
      .reduce((acc, curr) => acc + Number(curr.total_fee || 0), 0);

    const weeklyRevenue = jobs
      .filter((j) => new Date(j.created_at) >= startOfWeek)
      .reduce((acc, curr) => acc + Number(curr.total_fee || 0), 0);

    const monthlyRevenue = jobs
      .filter((j) => new Date(j.created_at) >= new Date(startOfMonth))
      .reduce((acc, curr) => acc + Number(curr.total_fee || 0), 0);

    const totalJobsToday = jobs.filter(
      (j) => new Date(j.created_at) >= new Date(startOfDay),
    ).length;

    // 5. Olah Data Grafik 7 Hari Terakhir
    const daysLabel = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
    const financialChart = Array.from({ length: 7 }).map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      const dayStart = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
      ).toISOString();
      const dayEnd = new Date(
        d.getFullYear(),
        d.getMonth(),
        d.getDate(),
        23,
        59,
        59,
      ).toISOString();

      const amount = jobs
        .filter((j) => j.created_at >= dayStart && j.created_at <= dayEnd)
        .reduce((acc, curr) => acc + Number(curr.total_fee || 0), 0);

      return {
        day: daysLabel[d.getDay()],
        amount,
      };
    });

    // 6. Aktivitas / Notifikasi Terakhir
    const { data: recentActivities } = await supabase
      .from("notifications")
      .select("*")
      .eq("mechanic_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5);

    return {
      success: true,
      data: {
        mechanicName: mechanic?.full_name || "Montir",
        mechanicStatus: mechanic?.status || "OFFLINE",
        activeJobs: activeJobs || [],
        stats: {
          todayRevenue,
          totalJobsToday,
          activeJobsCount: activeJobs?.length || 0,
          rating: mechanic?.rating || 5.0,
          totalReviews: mechanic?.total_reviews || 0,
        },
        financialSummary: {
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
