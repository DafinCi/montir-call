import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import AppNavbar from "@/components/layout/navbar/AppNavbar";

export default async function AppLayout({ children }) {
  const supabase = await createClient();

  // 1. Cek User Autentikasi
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  // 2. Ambil Profil Montir dari database public.mechanics
  const { data: mechanic } = await supabase
    .from("mechanics")
    .select("name, phone, status, specialization")
    .eq("id", user.id)
    .single();

  // 3. Ambil Jumlah Pesanan Masuk (PENDING) dari tabel service_requests
  const { count: pendingCount } = await supabase
    .from("service_requests")
    .select("*", { count: "exact", head: true })
    .eq("status", "PENDING");

  // Format data user untuk disalurkan ke UI
  const userData = {
    name: mechanic?.name || user.user_metadata?.name || "Montir",
    email: user.email,
    avatar: "",
    status: mechanic?.status || "OFFLINE",
  };

  return (
    <div className="flex min-h-screen bg-background">
      {/* Desktop Sidebar */}
      <AppSidebar user={userData} pendingCount={pendingCount || 0} />

      {/* Main Content Area */}
      <div className="flex min-w-0 flex-1 flex-col">
        {/* Navbar */}
        <AppNavbar user={userData} pendingCount={pendingCount || 0} />

        {/* Dynamic Page Content */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
      </div>
    </div>
  );
}
