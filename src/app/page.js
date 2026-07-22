import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = createClient();

  // Test koneksi dengan mengambil data (jika ada) atau sekadar test ping
  const { data, error } = await supabase.from("mechanics").select("*").limit(1);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24 bg-gray-50">
      <div className="bg-white p-8 rounded-xl shadow-md text-center max-w-md">
        <h1 className="text-2xl font-bold text-gray-800 mb-4">
          Smart Mechanic Setup
        </h1>

        {error ? (
          <div className="text-red-500 bg-red-50 p-4 rounded-lg">
            <p className="font-semibold">Koneksi Supabase Gagal ❌</p>
            <p className="text-sm mt-2">{error.message}</p>
          </div>
        ) : (
          <div className="text-green-600 bg-green-50 p-4 rounded-lg">
            <p className="font-semibold">Koneksi Supabase Berhasil! ✅</p>
            <p className="text-sm mt-2 text-gray-600">
              Database siap digunakan pakai JS.
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
