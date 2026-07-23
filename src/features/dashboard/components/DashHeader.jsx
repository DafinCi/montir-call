"use client";

import React from "react";
import { Power, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashHeader({ isOnline = true, onToggleOnline }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
      {/* Greeting & Subtitle */}
      <div className="space-y-1">
        <div className="flex items-center gap-2.5">
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-primary-foreground">
            Selamat Datang, Dafin!
          </h1>
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border ${
              isOnline
                ? "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"
                : "bg-muted text-muted-foreground border-border"
            }`}
          >
            <span
              className={`size-1.5 rounded-full ${
                isOnline ? "bg-emerald-500 animate-pulse" : "bg-muted-foreground"
              }`}
            />
            {isOnline ? "Siap Menerima Job" : "Istirahat"}
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
          className="gap-2 font-medium shadow-xs"
          onClick={onToggleOnline}
        >
          <Power className="size-3.5" />
          {isOnline ? "Matikan Status" : "Aktifkan Status"}
        </Button>

        <Button
          variant="outline"
          size="icon-sm"
          title="Refresh Data"
          className="group text-muted-foreground hover:text-foreground transition-colors"
        >
          <RefreshCw className="size-3.5 transition-transform duration-500 ease-in-out group-hover:rotate-180" />
        </Button>
      </div>
    </div>
  );
}