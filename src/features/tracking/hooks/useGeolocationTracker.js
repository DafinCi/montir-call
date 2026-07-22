"use client";

import { useEffect } from "react";
import { updateMechanicLocation } from "@/features/request/services/request.action";

export function useGeolocationTracker(isTrackingActive) {
  useEffect(() => {
    if (
      !isTrackingActive ||
      typeof window === "undefined" ||
      !("geolocation" in navigator)
    ) {
      return;
    }

    // Update GPS setiap kali posisi montir bergeser
    const watchId = navigator.geolocation.watchPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await updateMechanicLocation(latitude, longitude);
      },
      (error) => {
        console.error("Gagal mengambil lokasi GPS:", error.message);
      },
      {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 10000,
      },
    );

    return () => navigator.geolocation.clearWatch(watchId);
  }, [isTrackingActive]);
}
