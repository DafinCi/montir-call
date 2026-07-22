"use client";

import { useState, useEffect } from "react";
import { createClient } from "@/lib/supabase/client";
import {
  getNotifications,
  markNotificationAsRead,
} from "@/features/mechanic/services/mechanic.action";

export function useRealtimeNotifications(mechanicId) {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [newIncomingRequest, setNewIncomingRequest] = useState(null); // Untuk Modal Pop-up

  const supabase = createClient();

  // 1. Fetch awal list notifikasi
  useEffect(() => {
    if (!mechanicId) return;

    async function loadNotifications() {
      const res = await getNotifications();
      if (res.success) {
        setNotifications(res.data);
        setUnreadCount(res.data.filter((n) => !n.is_read).length);
      }
    }

    loadNotifications();
  }, [mechanicId]);

  // 2. Realtime Listener
  useEffect(() => {
    if (!mechanicId) return;

    const channel = supabase
      .channel(`mechanic-notifs-${mechanicId}`)
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `mechanic_id=eq.${mechanicId}`,
        },
        (payload) => {
          const newNotif = payload.new;

          // Tambah ke list notifikasi teratas
          setNotifications((prev) => [newNotif, ...prev]);
          setUnreadCount((prev) => prev + 1);

          // Jika tipe notifikasi adalah order darurat baru, set untuk modal pop-up
          if (newNotif.type === "REQUEST_CREATED") {
            setNewIncomingRequest(newNotif);
          }
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [mechanicId, supabase]);

  // Mark as read
  const handleMarkAsRead = async (notificationId) => {
    const res = await markNotificationAsRead(notificationId);
    if (res.success) {
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === notificationId ? { ...n, is_read: true } : n,
        ),
      );
      setUnreadCount((prev) => Math.max(0, prev - 1));
    }
  };

  return {
    notifications,
    unreadCount,
    newIncomingRequest,
    clearIncomingRequestAlert: () => setNewIncomingRequest(null),
    markAsRead: handleMarkAsRead,
  };
}
