"use client";

import { useState, useEffect, useCallback } from "react";
import {
  getMechanicProfile,
  toggleMechanicStatus,
} from "../services/mechanic.action";

export function useMechanic() {
  const [profile, setProfile] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [error, setError] = useState(null);

  // Fetch profil montir
  const fetchProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const res = await getMechanicProfile();

    if (res.success) {
      setProfile(res.data);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  // Fungsi toggle status AVAILABLE <-> OFFLINE
  const handleToggleStatus = async () => {
    if (!profile || isToggling) return;

    const nextStatus = profile.status === "AVAILABLE" ? "OFFLINE" : "AVAILABLE";
    setIsToggling(true);
    setError(null);

    const res = await toggleMechanicStatus(nextStatus);

    if (res.success) {
      setProfile((prev) => ({ ...prev, status: res.data.status }));
    } else {
      setError(res.error);
    }
    setIsToggling(false);
  };

  return {
    profile,
    isLoading,
    isToggling,
    error,
    toggleStatus: handleToggleStatus,
    refreshProfile: fetchProfile,
  };
}
