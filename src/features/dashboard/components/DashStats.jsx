"use client";

import React from "react";
import {
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
  ArrowUpRight,
  Wallet, // Tambahkan icon Wallet dari lucide-react
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashStats({ stats = {} }) {
  const statItems = [
    {
      title: "Pendapatan Hari Ini",
      value: `Rp ${(stats.todayRevenue || 0).toLocaleString("id-ID")}`,
      subtext: "Total pemasukan",
      icon: Wallet,
      color: "text-green-600 dark:text-green-400",
      bgColor: "bg-green-500/10",
      borderColor: "border-green-500/20",
    },
    {
      title: "Pekerjaan Selesai",
      value: `${stats.totalJobsToday || 0} Servis`,
      subtext: "Hari ini",
      icon: CheckCircle2,
      color: "text-emerald-600 dark:text-emerald-400",
      bgColor: "bg-emerald-500/10",
      borderColor: "border-emerald-500/20",
    },
    {
      title: "Panggilan Aktif",
      value: `${stats.activeJobsCount || 0} Pesanan`,
      subtext: "Perlu ditangani",
      icon: Clock,
      color: "text-blue-600 dark:text-blue-400",
      bgColor: "bg-blue-500/10",
      borderColor: "border-blue-500/20",
    },
    {
      title: "Rating Montir",
      value: `${stats.rating ? Number(stats.rating).toFixed(1) : "5.0"} / 5.0`,
      subtext: stats.totalReviews
        ? `${stats.totalReviews} ulasan`
        : "Evaluasi pelanggan",
      icon: Star,
      color: "text-amber-600 dark:text-amber-400",
      bgColor: "bg-amber-500/10",
      borderColor: "border-amber-500/20",
    },
  ];

  return (
    <Card className="bg-card text-card-foreground border-border shadow-xs rounded-2xl overflow-hidden">
      <CardContent className="p-4 sm:p-5 space-y-4">
        {/* Title Bar */}
        <div className="flex items-center justify-between border-b border-border/60 pb-3">
          <div className="flex items-center gap-2">
            <TrendingUp className="size-4 text-primary" />
            <h3 className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Ringkasan Performa Harian
            </h3>
          </div>
          <span className="text-[11px] font-semibold text-primary flex items-center gap-0.5 cursor-pointer hover:underline">
            Detail Performa <ArrowUpRight className="size-3" />
          </span>
        </div>

        {/* Update grid menjadi 4 kolom atau 2x2 di layar kecil */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {statItems.map((item, index) => {
            const Icon = item.icon;
            return (
              <div
                key={index}
                className="p-3.5 rounded-2xl border border-border bg-background hover:bg-accent/40 transition-all flex flex-col sm:flex-row items-start sm:items-center gap-3.5 shadow-2xs"
              >
                {/* DANA Icon Box */}
                <div
                  className={`size-11 shrink-0 rounded-2xl ${item.bgColor} border ${item.borderColor} flex items-center justify-center ${item.color} mb-2 sm:mb-0`}
                >
                  <Icon className="size-5" />
                </div>

                {/* Content */}
                <div className="space-y-0.5 min-w-0 w-full">
                  <p className="text-[11px] font-medium text-muted-foreground truncate">
                    {item.title}
                  </p>
                  <p className="text-sm sm:text-base font-extrabold text-card-foreground tracking-tight truncate">
                    {item.value}
                  </p>
                  <p className="text-[10px] text-muted-foreground/80 truncate">
                    {item.subtext}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
