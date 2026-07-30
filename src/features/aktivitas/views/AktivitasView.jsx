"use client";

import React, { useState, useEffect, useCallback } from "react";
import { Activity, Bell, RefreshCw, Search } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  Button,
  Input,
  Separator,
} from "@/components/ui";
import { fetchAktivitasData } from "../services/aktivitas.action";
import { AktivitasItem } from "../components/AktivitasItem";
import { AktivitasSkeleton } from "../skeleton/AktivitasSkeleton";

export default function AktivitasView() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const loadAktivitas = useCallback(async () => {
    setLoading(true);
    const res = await fetchAktivitasData();
    if (res.success) {
      setActivities(res.data);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadAktivitas();
  }, [loadAktivitas]);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadAktivitas();
    setRefreshing(false);
  };

  const filteredActivities = activities.filter((item) => {
    const title = item.title?.toLowerCase() || "";
    const message = (item.message || item.text || "").toLowerCase();
    const query = searchQuery.toLowerCase();
    return title.includes(query) || message.includes(query);
  });

  if (loading) {
    return <AktivitasSkeleton />;
  }

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto w-full space-y-5">
      {/* Header Halaman */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-card-foreground flex items-center gap-2">
            <Activity className="size-8 text-secondary-foreground" />
            Riwayat Aktivitas
          </h1>
          <p className="text-xs text-muted-foreground mt-0.5">
            Pantau semua notifikasi, pembaruan pekerjaan, dan catatan sistem harian Anda.
          </p>
        </div>

        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="group text-muted-foreground hover:text-muted transition-colors size-9 shrink-0 bg-card"
        >
          <RefreshCw 
            className={`size-3.5 transition-transform duration-500 ease-in-out ${refreshing
                  ? "animate-spin text-primary"
                  : "group-hover:rotate-180"
              }`} />
        </Button>
      </div>

      {/* Kontainer Utama Aktivitas */}
      <Card className="shadow-xs border-border bg-card">
        <CardHeader className="pb-3 border-b border-border">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <CardTitle className="text-base font-semibold">
                Daftar Notifikasi ({filteredActivities.length})
              </CardTitle>
              <CardDescription className="text-xs">
                Diurutkan berdasarkan waktu terbaru
              </CardDescription>
            </div>
          </div>
          
        </CardHeader>

        <CardContent className="p-3 sm:p-4">
          {filteredActivities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground space-y-2">
              <Bell className="size-10 mx-auto opacity-30 stroke-1" />
              <p className="text-sm font-medium">Tidak ada aktivitas ditemukan</p>
              <p className="text-xs text-muted-foreground/80">
              </p>
            </div>
          ) : (
            <div className="flex flex-col divide-y divide-border/60 hover:bg-none">
              {filteredActivities.map((item, index) => (
                <AktivitasItem key={item.id || index} item={item} />
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}