"use client";

import React from "react";
import { DollarSign, CheckCircle2, Clock, Star, TrendingUp } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export default function DashStats({ activeCount = 2 }) {
  const stats = [
    {
      title: "Pendapatan Hari Ini",
      value: "Rp 425.000",
      subtext: "+18% dari kemarin",
      trend: true,
      icon: DollarSign,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Pekerjaan Selesai",
      value: "6 Servis",
      subtext: "Target harian: 8 Servis",
      icon: CheckCircle2,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Panggilan Aktif",
      value: `${activeCount} Pesanan`,
      subtext: "Butuh penanganan segera",
      icon: Clock,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
    {
      title: "Rating Montir",
      value: "4.9 / 5.0",
      subtext: "Dari 128 ulasan pelanggan",
      icon: Star,
      color: "text-secondary",
      bgColor: "bg-secondary/10",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, idx) => {
        const Icon = stat.icon;
        return (
          <Card key={idx} className="transition-all hover:border-border/80 hover:shadow-xs">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-muted-foreground">
                  {stat.title}
                </span>
                <div className={`p-2 rounded-lg ${stat.bgColor} ${stat.color}`}>
                  <Icon className="size-4" />
                </div>
              </div>

              <div className="mt-3">
                <div className="text-2xl font-bold tracking-tight text-primary-foreground">
                  {stat.value}
                </div>
                <div className="flex items-center gap-1 mt-1 text-xs text-muted-foreground">
                  {stat.trend && <TrendingUp className="size-3 text-secondary" />}
                  <span className={stat.trend ? "text-secondary font-medium" : ""}>
                    {stat.subtext}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}