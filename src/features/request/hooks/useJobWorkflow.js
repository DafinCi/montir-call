"use client";

import { useState, useEffect, useCallback } from "react";
import { getActiveRequest } from "@/features/mechanic/services/mechanic.action";
import { acceptRequest, updateRequestStatus } from "../services/request.action";

export function useJobWorkflow() {
  const [activeJob, setActiveJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Ambil pekerjaan aktif saat pertama kali dimuat
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

  // 1. Terima Pekerjaan Darurat
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

  // 2. Transisi Status Pekerjaan (ON_THE_WAY -> ARRIVED -> COMPLETED)
  const handleUpdateStatus = async (newStatus) => {
    if (!activeJob || isSubmitting) return;

    setIsSubmitting(true);
    setError(null);

    const res = await updateRequestStatus(activeJob.id, newStatus);

    if (res.success) {
      // Jika COMPLETED / CANCELLED, kosongkan activeJob
      if (["COMPLETED", "CANCELLED"].includes(newStatus)) {
        setActiveJob(null);
      } else {
        setActiveJob(res.data);
      }
      setIsSubmitting(false);
      return { success: true };
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
