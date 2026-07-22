import { createServerClient } from "@supabase/ssr";
import { NextResponse } from "next/server";

// Mengubah 'middleware' menjadi 'proxy'
export async function proxy(request) {
  // 1. Inisialisasi response awal Next.js
  let supabaseResponse = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  // 2. Setup Supabase Client khusus untuk Proxy
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          // Update cookie di sisi request (supaya terbaca oleh operasi selanjutnya)
          cookiesToSet.forEach(({ name, value }) =>
            request.cookies.set(name, value),
          );

          // Re-inisialisasi response untuk menanamkan cookie baru ke browser
          supabaseResponse = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  // 3. Refresh JWT session secara otomatis
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  // 4. Aturan Proteksi Route

  // Kasus A: Belum login tapi mencoba masuk ke /dashboard -> tendang ke /login
  if (!user && pathname.startsWith("/dashboard")) {
    const url = request.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  // Kasus B: Sudah login tapi mencoba buka /login, /register, atau / -> arahkan ke /dashboard
  if (
    user &&
    (pathname === "/login" || pathname === "/register" || pathname === "/")
  ) {
    const url = request.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  return supabaseResponse;
}

// 5. Config Matcher tetap sama
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};
