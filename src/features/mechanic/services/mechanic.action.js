"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

/**
 * 1. TOGGLE AVAILABILITY STATUS (AVAILABLE <-> OFFLINE)
 */
export async function toggleMechanicStatus(newStatus) {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  if (!["AVAILABLE", "OFFLINE"].includes(newStatus)) {
    return { success: false, error: "Status tidak valid." };
  }

  const { data, error } = await supabase
    .from("mechanics")
    .update({ status: newStatus })
    .eq("id", user.id)
    .select()
    .single();

  if (error) return { success: false, error: error.message };

  revalidatePath("/dashboard");
  return { success: true, data };
}

/**
 * 2. GET MECHANIC PROFILE & STATS
 */
export async function getMechanicProfile() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  // Ambil data profil montir
  const { data: profile, error } = await supabase
    .from("mechanics")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) return { success: false, error: error.message };

  // Hitung total pekerjaan yang telah selesai
  const { count: completedCount } = await supabase
    .from("service_requests")
    .select("id", { count: "exact", head: true })
    .eq("assigned_mechanic_id", user.id)
    .eq("status", "COMPLETED");

  return {
    success: true,
    data: {
      ...profile,
      completed_jobs_count: completedCount || 0,
    },
  };
}

/**
 * 3. GET ACTIVE REQUEST (Pekerjaan yang sedang berjalan)
 */
export async function getActiveRequest() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("assigned_mechanic_id", user.id)
    .in("status", ["ACCEPTED", "ON_THE_WAY", "ARRIVED"])
    .maybeSingle();

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

/**
 * 4. GET SERVICE HISTORY (Riwayat Pekerjaan)
 */
export async function getRequestHistory() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("service_requests")
    .select("*")
    .eq("assigned_mechanic_id", user.id)
    .in("status", ["COMPLETED", "CANCELLED"])
    .order("created_at", { ascending: false });

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

/**
 * 5. GET NOTIFICATIONS & MARK AS READ
 */
export async function getNotifications() {
  const supabase = createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Unauthorized" };

  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("mechanic_id", user.id)
    .order("created_at", { ascending: false })
    .limit(20);

  if (error) return { success: false, error: error.message };

  return { success: true, data };
}

export async function markNotificationAsRead(notificationId) {
  const supabase = createClient();

  const { error } = await supabase
    .from("notifications")
    .update({ is_read: true })
    .eq("id", notificationId);

  if (error) return { success: false, error: error.message };

  return { success: true };
}

/**
 * 
 "use client"

import { useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'

export function useNotificationListener(mechanicId, onNewRequest) {
  const supabase = createClient()

  useEffect(() => {
    if (!mechanicId) return

    // Subscribe ke perubahan di tabel 'service_requests' dengan status 'PENDING'
    const channel = supabase
      .channel('realtime-requests')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'service_requests',
          filter: 'status=eq.PENDING'
        },
        (payload) => {
          console.log('Ada order darurat baru masuk!:', payload.new)
          if (onNewRequest) onNewRequest(payload.new)
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mechanicId])
}
 */

// realtime broadcast untuk tracking posisi montir (streaming tanpa DB insert)
// untuk menghemat live movement di peta

/*
// Di sisi Montir (Pengirim Koordinat GPS)
export function streamMechanicLocation(mechanicId, lat, lng) {
  const supabase = createClient()
  const channel = supabase.channel(`tracking-${mechanicId}`)

  channel.subscribe((status) => {
    if (status === 'SUBSCRIBED') {
      channel.send({
        type: 'broadcast',
        event: 'location-update',
        payload: { lat, lng, timestamp: new Date().toISOString() },
      })
    }
  })
}

// Di sisi Map UI (Penerima Koordinat)
export function useMechanicLocationTracking(mechanicId, onLocationUpdate) {
  const supabase = createClient()

  useEffect(() => {
    if (!mechanicId) return

    const channel = supabase
      .channel(`tracking-${mechanicId}`)
      .on('broadcast', { event: 'location-update' }, ({ payload }) => {
        if (onLocationUpdate) onLocationUpdate(payload)
      })
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [mechanicId])
}

*/
