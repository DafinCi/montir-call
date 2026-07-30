"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function getProfile() {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return { success: false, error: "Sesi anda telah berakhir." };
  }

  const { data: mechanic, error } = await supabase
    .from("mechanics")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error && error.code !== "PGRST116") {
    console.error("Gagal mengambil data profil:", error.message);
    return { success: false, error: "Gagal memuat profil." };
  }

  const profileData = {
    id: user.id,
    name: mechanic?.name || user.user_metadata?.full_name || "",
    phone: mechanic?.phone || user.phone || "",
    email: user.email || "",
    workshop: mechanic?.workshop_name || "",
    bankAccount: mechanic?.bank_account || "",
    address: mechanic?.address || "",
    specialization: mechanic?.specialization || "Spesialis Motor",
    skills: mechanic?.skills || [],
    radius: mechanic?.service_radius || 10,
    avatarUrl: mechanic?.avatar_url || null,
    rating: mechanic?.rating || 5.0,
  };

  return { success: true, data: profileData };
}

export async function updateProfile(payload) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return { success: false, error: "Sesi anda telah berakhir." };
  }

  const updateData = {
    id: user.id,
    name: payload.name,
    phone: payload.phone,
    workshop_name: payload.workshop,
    bank_account: payload.bankAccount,
    address: payload.address,
    skills: payload.skills || [],
    service_radius: Number(payload.radius) || 10,
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("mechanics")
    .upsert(updateData)
    .select()
    .single();

  if (error) {
    console.error("Gagal memperbarui profil:", error.message);
    return { success: false, error: "Gagal menyimpan perubahan profil." };
  }

  revalidatePath("/profile");
  return { success: true, data };
}

export async function uploadAvatar(formData) {
  const supabase = await createClient();

  const {
    data: { user },
    error: authErr,
  } = await supabase.auth.getUser();

  if (authErr || !user) {
    return { success: false, error: "Sesi anda telah berakhir." };
  }

  const file = formData.get("file");
  if (!file) {
    return { success: false, error: "File gambar tidak ditemukan." };
  }

  const fileExt = file.name.split(".").pop();
  const filePath = `${user.id}/avatar.${fileExt}`;

  const { error: uploadErr } = await supabase.storage
    .from("avatars")
    .upload(filePath, file, { upsert: true });

  if (uploadErr) {
    console.error("Gagal upload avatar:", uploadErr.message);
    return { success: false, error: "Gagal mengunggah foto profil." };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(filePath);

  await supabase
    .from("mechanics")
    .update({ avatar_url: publicUrl })
    .eq("id", user.id);

  revalidatePath("/profile");
  return { success: true, avatarUrl: publicUrl };
}
