"use client";

import React from "react";
import { DollarSign, CheckCircle2, Clock, Star } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashStats({ stats = {} }) {
  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number || 0);
  };

  const statItems = [
    {
      title: "Pendapatan Hari Ini",
      value: formatRupiah(stats.todayRevenue),
      subtext: "Total estimasi hari ini",
      icon: DollarSign,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Pekerjaan Selesai",
      value: `${stats.totalJobsToday || 0} Servis`,
      subtext: "Total servis sukses hari ini",
      icon: CheckCircle2,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Panggilan Aktif",
      value: `${stats.activeJobsCount || 0} Pesanan`,
      subtext: "Butuh penanganan segera",
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Rating Montir",
      value: stats.rating
        ? `${Number(stats.rating).toFixed(1)} / 5.0`
        : "Belum Ada",
      subtext: stats.totalReviews
        ? `Dari ${stats.totalReviews} ulasan`
        : "Berdasarkan evaluasi customer",
      icon: Star,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card
            key={idx}
            className="transition-all hover:border-border/80 shadow-xs"
          >
            <CardContent className="px-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>

              <div className="mt-3 space-y-1">
                <div className="text-2xl font-bold tracking-tight text-muted">
                  {stat.value}
                </div>
                <div className="text-xs text-muted-foreground">
                  {stat.subtext}
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
