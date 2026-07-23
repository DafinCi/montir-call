import AppSidebar from "@/components/layout/sidebar/AppSidebar";
import AppNavbar from "@/components/layout/navbar/AppNavbar";

// import { createServerClient } from '@/lib/supabase/server';
// import { redirect } from 'next/navigation';

export default async function AppLayout({ children }) {
//   const supabase = createServerClient();
//   const { data: { session } } = await supabase.auth.getSession();

//   // 🔴 JIKA ADA KODE INI, DIA AKAN SELALU MELEMPAR KE LOGIN JIKA BELUM LOGIN
//   if (!session) {
//     redirect('//login'); 
//   }
  return (
    <div className="flex min-h-screen bg-secondary/20">

      {/* Desktop Sidebar */}
      <AppSidebar />

      {/* Content */}
      <div className="flex min-w-0 flex-1 flex-col">

        {/* Navbar */}
        <AppNavbar />

        {/* Main */}
        <main className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-8">
          {children}
        </main>

      </div>

    </div>
  );
}