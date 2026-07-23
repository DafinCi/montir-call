"use client";

import { useState, useEffect } from 'react';
import { fetchDashboardData, toggleMechanicStatus } from '../service/dashboard.action';

export const useDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        setLoading(true);
        const result = await fetchDashboardData();
        setData(result);
        setIsOnline(result.onlineStatus);
      } catch (err) {
        setError('Gagal memuat data dashboard');
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  const handleToggleOnline = async () => {
    try {
      const newStatus = await toggleMechanicStatus(isOnline);
      setIsOnline(newStatus);
    } catch (err) {
      console.error('Gagal mengubah status', err);
    }
  };

  return {
    data,
    loading,
    error,
    isOnline,
    handleToggleOnline,
  };
};