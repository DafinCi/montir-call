"use client";

import { useState, useEffect, useCallback } from "react";
import { fetchDashboardData } from "../services/dashboard.action";
import { toggleMechanicStatus } from "@/features/mechanic/services/mechanic.action";
import { updateRequestStatus } from "@/features/request/services/request.action";

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [isUpdatingJob, setIsUpdatingJob] = useState(false);
  const [error, setError] = useState(null);

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    const res = await fetchDashboardData();
    if (res.success) {
      setData(res.data);
    } else {
      setError(res.error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  // Toggle Availability Status
  const handleToggleOnline = async () => {
    if (!data || isToggling) return;
    const nextStatus =
      data.mechanicStatus === "AVAILABLE" ? "OFFLINE" : "AVAILABLE";

    setIsToggling(true);
    const res = await toggleMechanicStatus(nextStatus);

    if (res.success && res.data) {
      setData((prev) => ({
        ...prev,
        mechanicStatus: res.data.status,
      }));
    } else {
      console.error("❌ Gagal toggle status montir:", res.error);
    }
    setIsToggling(false);
  };

// Update Status Pekerjaan
const handleUpdateJobStatus = async (requestId, newStatus, extraData = {}) => {
  setIsUpdatingJob(true);

  // Teruskan extraData (yang berisi totalFee) ke server action
  const res = await updateRequestStatus(requestId, newStatus, extraData);

  if (res.success) {
    // Reload dashboard untuk memperbarui Saldo, FinancialChart, FinancialSummary, & RecentActivities
    await loadDashboard();
  }

  setIsUpdatingJob(false);
  return res;
};

  return {
    data,
    loading,
    error,
    isToggling,
    isUpdatingJob,
    handleToggleOnline,
    handleUpdateJobStatus,
    refreshDashboard: loadDashboard,
  };
};
