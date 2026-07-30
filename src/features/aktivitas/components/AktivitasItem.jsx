"use client";

import React from "react";
import { Bell, CheckCircle2, AlertCircle, Wrench, Wallet } from "lucide-react";
import { Badge } from "@/components/ui";

export function AktivitasItem({ item }) {
  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  // Pilih ikon & warna badge berdasarkan judul atau tipe aktivitas
  const getIconAndBadge = (title = "") => {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes("selesai") || lowerTitle.includes("sukses")) {
      return {
        icon: <CheckCircle2 className="size-5 text-secondary" />,
        badgeClass: "bg-emerald-500/10 text-emerald-600 border-emerald-200",
        label: "Selesai",
      };
    }
    if (lowerTitle.includes("pesanan") || lowerTitle.includes("order")) {
      return {
        icon: <Wrench className="size-5 text-secondary" />,
        badgeClass: "bg-secondary/20 text-secondary-foreground border-secondary/30",
        label: "Pesanan",
      };
    }
    if (lowerTitle.includes("saldo") || lowerTitle.includes("pembayaran")) {
      return {
        icon: <Wallet className="size-5 text-secondary" />,
        badgeClass: "bg-blue-500/10 text-blue-600 border-blue-200",
        label: "Keuangan",
      };
    }
    return {
      icon: <Bell className="size-5 text-secondary" />,
      badgeClass: "bg-secondary/5 text-secondary border-border",
      label: "Sistem",
    };
  };

  const config = getIconAndBadge(item.title);

  return (
    <div className="flex items-start gap-3.5 p-3.5 rounded-lg hover:bg-secondary/5 transition-colors border border-transparent hover:border-border/60">
      <div className="p-2.5 rounded-full bg-secondary/10 shrink-0 mt-0.5">
        {config.icon}
      </div>

      <div className="flex-1 min-w-0 space-y-1">
        <div className="flex items-center justify-between gap-2">
          <p className="text-sm font-semibold text-card-foreground truncate">
            {item.title || "Notifikasi Baru"}
          </p>
          <Badge variant="outline" className={`text-[10px] px-2 py-0.5 ${config.badgeClass}`}>
            {config.label}
          </Badge>
        </div>

        <p className="text-xs text-muted-foreground leading-relaxed">
          {item.message || item.text}
        </p>

        <span className="text-[10px] text-muted-foreground/80 block pt-1">
          {formatDateTime(item.created_at)}
        </span>
      </div>
    </div>
  );
}