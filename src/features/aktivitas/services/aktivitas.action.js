"use server";

import { createClient } from "@/lib/supabase/server";

export async function fetchAktivitasData() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    const { data: activities, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("mechanic_id", user.id)
      .order("created_at", { ascending: false });

    if (error) throw error;

    return {
      success: true,
      data: activities || [],
    };
  } catch (error) {
    console.error("Error fetchAktivitasData:", error);
    return { success: false, error: error.message };
  }
}