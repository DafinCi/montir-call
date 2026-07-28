"use client";

import { useState, useEffect, useCallback } from "react";
import { getActiveRequest } from "@/features/mechanic/services/mechanic.action";
import { acceptRequest, updateRequestStatus } from "../services/request.action";

export function useJobWorkflow() {
  const [activeJob, setActiveJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchActiveJob = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const res = await getActiveRequest();

    if (res.success) {
      setActiveJob(res.data);
    } else {
      setError(res.error);
    }
    setIsLoading(false);
  }, []);

  useEffect(() => {
    fetchActiveJob();
  }, [fetchActiveJob]);

  const handleAcceptJob = async (requestId) => {
    setIsSubmitting(true);
    setError(null);

    const res = await acceptRequest(requestId);

    if (res.success) {
      setActiveJob(res.data);
      setIsSubmitting(false);
      return { success: true, message: res.message };
    } else {
      setError(res.error);
      setIsSubmitting(false);
      return { success: false, error: res.error };
    }
  };

  // Transisi Status Pekerjaan Fleksibel (Mendukung 2 atau 3 parameter)
  const handleUpdateStatus = async (arg1, arg2, arg3) => {
    if (!activeJob || isSubmitting)
      return { success: false, error: "Pekerjaan tidak aktif" };

    setIsSubmitting(true);
    setError(null);

    let targetStatus;
    let additionalData = {};

    // Normalisasi parameter pintar
    const validStatuses = ["ON_THE_WAY", "ARRIVED", "COMPLETED", "CANCELLED"];

    if (validStatuses.includes(arg1)) {
      // Format: handleUpdateStatus("COMPLETED", { totalFee: 150000 })
      targetStatus = arg1;
      additionalData = arg2 || {};
    } else if (validStatuses.includes(arg2)) {
      // Format: handleUpdateStatus(jobId, "COMPLETED", { totalFee: 150000 })
      targetStatus = arg2;
      additionalData = arg3 || {};
    } else {
      setIsSubmitting(false);
      return { success: false, error: "Status pekerjaan tidak valid." };
    }

    const res = await updateRequestStatus(
      activeJob.id,
      targetStatus,
      additionalData,
    );

    if (res.success) {
      if (["COMPLETED", "CANCELLED"].includes(targetStatus)) {
        setActiveJob(null);
      } else {
        setActiveJob(res.data);
      }
      setIsSubmitting(false);
      return { success: true, data: res.data };
    } else {
      setError(res.error);
      setIsSubmitting(false);
      return { success: false, error: res.error };
    }
  };

  return {
    activeJob,
    isLoading,
    isSubmitting,
    error,
    acceptJob: handleAcceptJob,
    updateStatus: handleUpdateStatus,
    refreshActiveJob: fetchActiveJob,
  };
}
