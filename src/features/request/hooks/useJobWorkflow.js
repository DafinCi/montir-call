"use client";

import { useState, useEffect, useCallback } from "react";
import { getActiveRequest } from "@/features/mechanic/services/mechanic.action";
import { acceptRequest, updateRequestStatus } from "../services/request.action";

/**
 * Helper untuk menormalisasi data job agar konsisten
 * antara snake_case (database) dan camelCase (komponen UI)
 */
function normalizeJobData(item) {
  if (!item) return null;

  const isEmergency =
    item.is_emergency === true ||
    item.isEmergency === true ||
    String(item.priority || "").toLowerCase() === "emergency" ||
    String(item.priority || "").toLowerCase() === "critical" ||
    String(item.ai_analysis?.urgency || "").toUpperCase() === "CRITICAL" ||
    String(item.service_type || "").toLowerCase() === "emergency";

  return {
    ...item,
    id: item.id,
    customerName:
      item.customerName || item.customer_name || item.user_name || "Pelanggan",
    customerPhone: item.customerPhone || item.customer_phone || item.phone || "",
    createdAt: item.createdAt || item.created_at || "Baru saja",
    priority: isEmergency ? "emergency" : "scheduled",
    isEmergency,
    vehicleModel:
      item.vehicleModel ||
      item.vehicle_model ||
      item.vehicle_type ||
      "Kendaraan Pelanggan",
    licensePlate:
      item.licensePlate || item.license_plate || item.vehicle_plate || "-",
    problemDescription:
      item.problemDescription ||
      item.problem_description ||
      item.description ||
      "Tidak ada rincian keluhan.",
    aiAnalysis: item.aiAnalysis || item.ai_analysis || null,
    locationTitle:
      item.locationTitle || item.location_title || item.place_name || "Lokasi Pelanggan",
    locationAddress:
      item.locationAddress ||
      item.location_address ||
      item.address ||
      "Alamat lokasi tidak tersedia",
    customerLocation: item.customerLocation || item.customer_location || null,
  };
}

export function useJobWorkflow() {
  const [activeJob, setActiveJob] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);

  // Fetch Pekerjaan Aktif Montir saat ini
  const fetchActiveJob = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await getActiveRequest();

      if (res.success && res.data) {
        setActiveJob(normalizeJobData(res.data));
      } else {
        setActiveJob(null);
        if (res.error) setError(res.error);
      }
    } catch (err) {
      console.error("Gagal memuat pekerjaan aktif:", err);
      setError("Gagal terhubung ke server.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchActiveJob();
  }, [fetchActiveJob]);

  // Terima Pekerjaan Baru
  const handleAcceptJob = async (requestId) => {
    if (!requestId || isSubmitting) {
      return { success: false, error: "Permintaan tidak valid atau sedang diproses." };
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const res = await acceptRequest(requestId);

      if (res.success) {
        const normalized = normalizeJobData(res.data);
        setActiveJob(normalized);
        return { success: true, message: res.message, data: normalized };
      } else {
        setError(res.error);
        return { success: false, error: res.error };
      }
    } catch (err) {
      const errorMsg = err?.message || "Terjadi kesalahan saat menerima pekerjaan.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
    }
  };

  // Transisi Status Pekerjaan Fleksibel (Mendukung 2 atau 3 parameter)
  const handleUpdateStatus = async (arg1, arg2, arg3) => {
    if (isSubmitting) {
      return { success: false, error: "Proses sebelumnya masih berjalan." };
    }

    setIsSubmitting(true);
    setError(null);

    let targetJobId;
    let targetStatus;
    let additionalData = {};

    const validStatuses = ["ON_THE_WAY", "ARRIVED", "COMPLETED", "CANCELLED"];

    // Normalisasi parameter pintar
    if (validStatuses.includes(arg1)) {
      // Format: handleUpdateStatus("COMPLETED", { totalFee: 150000 })
      targetJobId = activeJob?.id;
      targetStatus = arg1;
      additionalData = arg2 || {};
    } else if (validStatuses.includes(arg2)) {
      // Format: handleUpdateStatus(jobId, "COMPLETED", { totalFee: 150000 })
      targetJobId = arg1;
      targetStatus = arg2;
      additionalData = arg3 || {};
    } else {
      setIsSubmitting(false);
      return { success: false, error: "Status pekerjaan tidak valid." };
    }

    if (!targetJobId) {
      setIsSubmitting(false);
      return { success: false, error: "ID pekerjaan tidak ditemukan atau tidak aktif." };
    }

    try {
      const res = await updateRequestStatus(
        targetJobId,
        targetStatus,
        additionalData
      );

      if (res.success) {
        if (["COMPLETED", "CANCELLED"].includes(targetStatus)) {
          setActiveJob(null);
        } else {
          const normalized = normalizeJobData(res.data);
          setActiveJob(normalized);
        }
        return { success: true, data: res.data };
      } else {
        setError(res.error);
        return { success: false, error: res.error };
      }
    } catch (err) {
      const errorMsg = err?.message || "Gagal memperbarui status pekerjaan.";
      setError(errorMsg);
      return { success: false, error: errorMsg };
    } finally {
      setIsSubmitting(false);
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