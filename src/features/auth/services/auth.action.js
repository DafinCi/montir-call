"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation"; // 1. Import redirect

export async function registerMechanic(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");
  const phone = formData.get("phone");

  if (!email || !password || !name || !phone) {
    return { success: false, error: "Mohon isi seluruh kolom pendaftaran." };
  }

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { name, phone },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

export async function loginMechanic(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  if (!email || !password) {
    return { success: false, error: "Email dan password wajib diisi." };
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    const errorMsg =
      error.message === "Invalid login credentials"
        ? "Email atau password yang Anda masukkan salah."
        : error.message;

    return { success: false, error: errorMsg };
  }

  // 2. Revalidate cache dan langsung alihkan pengguna di Server
  revalidatePath("/", "layout");
  redirect("/dashboard");
}

export async function logoutMechanic() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  revalidatePath("/", "layout");
  redirect("/login");
}
