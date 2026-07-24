"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const FinancialChart = ({ data = [] }) => {
  // Hitung nilai tertinggi untuk persentase tinggi bar grafik
  const maxVal = Math.max(...data.map((d) => d.amount || 0), 1);

  return (
    <Card className="shadow-xs shrink-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Grafik Pendapatan 7 Hari Terakhir
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-40 pt-4">
          {data.length === 0 ? (
            <div className="w-full flex items-center justify-center text-xs text-muted-foreground h-full">
              Belum ada data pendapatan
            </div>
          ) : (
            data.map((item, idx) => {
              const heightPercent =
                item.amount > 0 ? (item.amount / maxVal) * 100 : 4;

              return (
                <div
                  key={idx}
                  className="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
                >
                  <span className="text-[10px] font-medium text-muted-foreground group-hover:text-primary transition-colors">
                    {item.amount >= 1000
                      ? `${(item.amount / 1000).toFixed(0)}k`
                      : item.amount}
                  </span>
                  <div
                    style={{ height: `${heightPercent}%` }}
                    className={`w-full rounded-t-md transition-all duration-300 ${
                      item.amount > 0
                        ? "bg-primary hover:bg-primary/80"
                        : "bg-muted hover:bg-muted/80"
                    }`}
                  />
                  <span className="text-xs font-medium text-muted-foreground">
                    {item.day}
                  </span>
                </div>
              );
            })
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialChart;
