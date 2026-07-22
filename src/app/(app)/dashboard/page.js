import {
  getMechanicProfile,
  toggleMechanicStatus,
} from "@/features/mechanic/services/mechanic.action";
import { logoutMechanic } from "@/features/auth/services/auth.action";

export default async function DashboardPage() {
  // 1. Fetch data profil montir dari backend action
  const profileResult = await getMechanicProfile();

  if (!profileResult.success) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
        <div className="bg-white p-6 rounded-lg shadow-md text-center text-red-600">
          Gagal memuat profil: {profileResult.error}
        </div>
      </div>
    );
  }

  const mechanic = profileResult.data;
  const isAvailable = mechanic.status === "AVAILABLE";

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-xl mx-auto space-y-6">
        {/* Header Dashboard */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">
              Mechanic Dashboard
            </h1>
            <p className="text-sm text-gray-500">
              Selamat datang,{" "}
              <span className="font-semibold text-gray-700">
                {mechanic.name}
              </span>
            </p>
          </div>

          {/* Tombol Logout */}
          <form action={logoutMechanic}>
            <button
              type="submit"
              className="px-3 py-1.5 text-xs font-semibold text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition"
            >
              Logout
            </button>
          </form>
        </div>

        {/* Card Status & Profile Montir */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 space-y-4">
          <div className="flex justify-between items-center pb-4 border-b">
            <div>
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider">
                Status Bekerja
              </p>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`inline-block w-3 h-3 rounded-full ${
                    mechanic.status === "AVAILABLE"
                      ? "bg-green-500 animate-pulse"
                      : mechanic.status === "BUSY"
                        ? "bg-amber-500"
                        : "bg-gray-400"
                  }`}
                />
                <span className="font-bold text-lg text-gray-800">
                  {mechanic.status}
                </span>
              </div>
            </div>

            {/* Form Toggle Status (Server Action) */}
            <form
              action={async () => {
                "use server";
                const nextStatus = isAvailable ? "OFFLINE" : "AVAILABLE";
                await toggleMechanicStatus(nextStatus);
              }}
            >
              <button
                type="submit"
                className={`px-4 py-2 text-sm font-semibold rounded-lg shadow-sm transition ${
                  isAvailable
                    ? "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    : "bg-green-600 text-white hover:bg-green-700"
                }`}
              >
                {isAvailable ? "Set OFFLINE" : "Set AVAILABLE (Go Online)"}
              </button>
            </form>
          </div>

          {/* Info Statistik Montir */}
          <div className="grid grid-cols-2 gap-4 pt-2 text-sm">
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-gray-500 text-xs">Rating Montir</p>
              <p className="text-lg font-semibold text-gray-800">
                ⭐ {mechanic.rating || "5.0"}
              </p>
            </div>
            <div className="bg-gray-50 p-3 rounded-lg border">
              <p className="text-gray-500 text-xs">Total Servis Selesai</p>
              <p className="text-lg font-semibold text-gray-800">
                {mechanic.completed_jobs_count || 0} Pekerjaan
              </p>
            </div>
          </div>
        </div>

        {/* Panel Dev / Tester Tools */}
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-xl space-y-2">
          <h3 className="text-xs font-bold text-blue-900 uppercase tracking-wider">
            🛠️ Dev Testing Info
          </h3>
          <p className="text-xs text-blue-700">
            Gunakan UUID ini untuk payload API Simulator (`mechanic_id`):
          </p>
          <div className="bg-white p-2 rounded border border-blue-200 text-xs font-mono select-all text-gray-700 break-all">
            {mechanic.id}
          </div>
        </div>
      </div>
    </div>
  );
}
