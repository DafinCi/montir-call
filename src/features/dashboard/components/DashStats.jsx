"use client";

import React from "react";
import {
  DollarSign,
  CheckCircle2,
  Clock,
  Star,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashStats({ stats = {} }) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number || 0);
  };

  return (
    <Card className="bg-card text-card-foreground border-border shadow-xs overflow-hidden">
      <CardContent className="p-4 sm:p-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* HERO METRIC: Pendapatan Hari Ini */}
          <div className="lg:col-span-5 bg-secondary/10 border border-secondary/20 rounded-2xl p-5 flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-secondary text-secondary-foreground">
                  <DollarSign className="size-5" />
                </div>
                <span className="text-xs font-bold text-secondary-foreground tracking-wide uppercase">
                  Pendapatan Hari Ini
                </span>
              </div>
              <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-secondary/20 text-secondary-foreground flex items-center gap-1">
                <TrendingUp className="size-3" /> Real-time
              </span>
            </div>

            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tracking-tight text-card-foreground">
                {formatRupiah(stats.todayRevenue)}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                Total estimasi akumulasi pendapatan hari ini
              </p>
            </div>
          </div>

          {/* SUB METRICS: 3 Kolom Pendukung */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Pekerjaan Selesai */}
            <div className="p-4 rounded-xl border border-border bg-background/50 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Selesai
                </span>
                <div className="p-1.5 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400">
                  <CheckCircle2 className="size-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-card-foreground">
                  {stats.totalJobsToday || 0} Servis
                </div>
                <p className="text-[11px] text-muted-foreground">Hari ini</p>
              </div>
            </div>

            {/* Panggilan Aktif */}
            <div className="p-4 rounded-xl border border-border bg-background/50 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Aktif
                </span>
                <div className="p-1.5 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400">
                  <Clock className="size-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-card-foreground">
                  {stats.activeJobsCount || 0} Pesanan
                </div>
                <p className="text-[11px] text-muted-foreground">
                  Butuh penanganan
                </p>
              </div>
            </div>

            {/* Rating Montir */}
            <div className="p-4 rounded-xl border border-border bg-background/50 flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  Rating
                </span>
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Star className="size-4" />
                </div>
              </div>
              <div>
                <div className="text-xl font-bold text-card-foreground">
                  {stats.rating ? Number(stats.rating).toFixed(1) : "5.0"}
                  <span className="text-xs font-normal text-muted-foreground">
                    {" "}
                    / 5.0
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground">
                  {stats.totalReviews
                    ? `${stats.totalReviews} ulasan`
                    : "Evaluasi user"}
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
