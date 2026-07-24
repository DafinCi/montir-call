"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export const FinancialSummary = ({
  summary = { daily: 0, weekly: 0, monthly: 0 },
}) => {
  const formatRupiah = (val) =>
    new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val || 0);

  return (
    <Card className="shadow-xs flex flex-col justify-between h-full">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-semibold text-muted">
          Ringkasan Pendapatan
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-2 my-auto">
        <div className="flex justify-between items-center pb-2.5 border-b border-border/60">
          <span className="text-xs text-muted-foreground font-medium">
            Hari Ini
          </span>
          <span className="text-sm font-bold text-emerald-600 dark:text-emerald-400">
            {formatRupiah(summary.daily)}
          </span>
        </div>
        <div className="flex justify-between items-center pb-2.5 border-b border-border/60">
          <span className="text-xs text-muted-foreground font-medium">
            Minggu Ini
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatRupiah(summary.weekly)}
          </span>
        </div>
        <div className="flex justify-between items-center">
          <span className="text-xs text-muted-foreground font-medium">
            Bulan Ini
          </span>
          <span className="text-sm font-bold text-foreground">
            {formatRupiah(summary.monthly)}
          </span>
        </div>
      </CardContent>
    </Card>
  );
};

export default FinancialSummary;
