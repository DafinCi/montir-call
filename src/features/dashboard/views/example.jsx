"use client";

import { useMechanic } from "@/features/mechanic/hooks/useMechanic";
import { useJobWorkflow } from "@/features/request/hooks/useJobWorkflow";
import { useRealtimeNotifications } from "@/features/notification/hooks/useRealtimeNotifications";
import { useGeolocationTracker } from "@/features/tracking/hooks/useGeolocationTracker";

export default function DashboardView() {
  const { profile, toggleStatus, isToggling } = useMechanic();
  const { activeJob, acceptJob, updateStatus, isSubmitting } = useJobWorkflow();
  const { newIncomingRequest, clearIncomingRequestAlert } =
    useRealtimeNotifications(profile?.id);

  // Aktifkan auto GPS tracking jika montir sedang jalan/tiba di lokasi
  useGeolocationTracker(
    activeJob && ["ON_THE_WAY", "ARRIVED"].includes(activeJob.status),
  );

  return (
    <div>
      {/* Tombol Toggle Availability */}
      <button onClick={toggleStatus} disabled={isToggling}>
        Status: {profile?.status}
      </button>

      {/* Pop-up Jika Ada Order Darurat Masuk via Simulator */}
      {newIncomingRequest && (
        <div className="modal">
          <h3>🚨 {newIncomingRequest.title}</h3>
          <p>{newIncomingRequest.message}</p>
          <button
            onClick={async () => {
              const res = await acceptJob(newIncomingRequest.request_id);
              if (res.success) clearIncomingRequestAlert();
            }}
          >
            Terima Pekerjaan
          </button>
        </div>
      )}

      {/* Kontrol Pekerjaan Aktif */}
      {activeJob && (
        <div>
          <h3>Pekerjaan Aktif: {activeJob.customer_name}</h3>
          <p>Status: {activeJob.status}</p>
          {activeJob.status === "ACCEPTED" && (
            <button onClick={() => updateStatus("ON_THE_WAY")}>
              Menuju Lokasi
            </button>
          )}
          {activeJob.status === "ON_THE_WAY" && (
            <button onClick={() => updateStatus("ARRIVED")}>
              Sampai di Lokasi
            </button>
          )}
          {activeJob.status === "ARRIVED" && (
            <button onClick={() => updateStatus("COMPLETED")}>
              Selesai Perbaikan
            </button>
          )}
        </div>
      )}
    </div>
  );
}
