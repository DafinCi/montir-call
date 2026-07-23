"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DEFAULT_CHART_DATA = [
  { day: "Sen", amount: 250000 },
  { day: "Sel", amount: 400000 },
  { day: "Rab", amount: 320000 },
  { day: "Kam", amount: 510000 },
  { day: "Jum", amount: 425000 },
  { day: "Sab", amount: 680000 },
  { day: "Min", amount: 550000 },
];

export const FinancialChart = ({ data = DEFAULT_CHART_DATA }) => {
  const maxVal = Math.max(...data.map((d) => d.amount || 0)) || 1;

  return (
    <Card className="shadow-xs shrink-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-foreground">
          Grafik Pendapatan (Rp)
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end justify-between gap-2 h-38 pt-4">
          {data.map((item, idx) => {
            const heightPercent = (item.amount / maxVal) * 100;
            return (
              <div key={idx} className="flex-1 flex flex-col items-center gap-2 h-full justify-end">
                <span className="text-[10px] font-medium text-muted-foreground">
                  {(item.amount / 1000).toFixed(0)}k
                </span>
                <div
                  style={{ height: `${heightPercent}%` }}
                  className="w-full bg-secondary hover:bg-secondary/30 rounded-t-md transition-all duration-300"
                ></div>
                <span className="text-xs font-medium text-muted-foreground">{item.day}</span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};