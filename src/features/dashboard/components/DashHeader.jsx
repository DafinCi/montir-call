"use client";

import React from "react";
import { Power, RefreshCw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashHeader({
  mechanicName = "Montir",
  status = "OFFLINE",
  onToggleOnline,
  isToggling = false,
  onRefresh,
  isRefreshing = false,
}) {
  const isOnline = status === "AVAILABLE";
  const isBusy = status === "BUSY";

  const getStatusText = () => {
    if (isBusy) return "Sedang Sibuk";
    if (isOnline) return "Siap Menerima Job";
    return "Istirahat / Off";
  };

  const getStatusBadgeStyle = () => {
    if (isBusy)
      return "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20";
    if (isOnline)
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20";
    return "bg-muted text-muted-foreground border-border";
  };

  const getStatusDotStyle = () => {
    if (isBusy) return "bg-amber-500 animate-pulse";
    if (isOnline) return "bg-emerald-500 animate-pulse";
    return "bg-muted-foreground";
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
      {/* Greeting & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
            Selamat Datang, {mechanicName}!
          </h1>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusBadgeStyle()}`}
          >
            <span className={`size-1.5 rounded-full ${getStatusDotStyle()}`} />
            {getStatusText()}
          </span>
        </div>
        <p className="text-sm text-muted-foreground">
          Pantau panggilan darurat dan statistik perbaikan kendaraanmu hari ini.
        </p>
      </div>

      {/* Action Controls */}
      <div className="flex items-center gap-2.5 shrink-0">
        <Button
          variant={isOnline ? "destructive" : "default"}
          size="sm"
          disabled={isToggling || isBusy}
          className="gap-2 font-medium shadow-xs"
          onClick={onToggleOnline}
        >
          {isToggling ? (
            <Loader2 className="size-3.5 animate-spin" />
          ) : (
            <Power className="size-3.5" />
          )}
          {isBusy
            ? "Sedang Melayani"
            : isOnline
              ? "Matikan Status"
              : "Aktifkan Status"}
        </Button>

        {onRefresh && (
          <Button
            variant="outline"
            size="icon"
            title="Refresh Data"
            disabled={isRefreshing}
            onClick={onRefresh}
            className="group text-muted-foreground hover:text-foreground transition-colors size-9"
          >
            <RefreshCw
              className={`size-3.5 ${
                isRefreshing ? "animate-spin text-primary" : ""
              }`}
            />
          </Button>
        )}
      </div>
    </div>
  );
}
