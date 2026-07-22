"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

/**
 * Register Montir Baru
 * Metadata (name, phone) akan otomatis ditangkap oleh Trigger PostgreSQL
 * dan dimasukkan ke tabel `public.mechanics`.
 */
export async function registerMechanic(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");
  const name = formData.get("name");
  const phone = formData.get("phone");

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: {
        name,
        phone,
      },
    },
  });

  if (error) {
    return { success: false, error: error.message };
  }

  return { success: true, data };
}

/**
 * Login Montir
 * @supabase/ssr akan otomatis mengurus set-cookie JWT session di browser.
 */
export async function loginMechanic(formData) {
  const supabase = await createClient();

  const email = formData.get("email");
  const password = formData.get("password");

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    return { success: false, error: error.message };
  }

  // Clear cache Next.js agar UI dashboard terbaru ter-render
  revalidatePath("/", "layout");

  // Arahkan montir ke dashboard setelah login sukses
  redirect("/dashboard");
}

/**
 * Logout Montir
 */
export async function logoutMechanic() {
  const supabase = await createClient();

  await supabase.auth.signOut();

  revalidatePath("/", "layout");
  redirect("/login");
}

// frontend langsung panggil fungsinya saja
