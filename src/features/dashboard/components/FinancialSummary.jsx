"use client";

import React from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

const DEFAULT_SUMMARY = {
  daily: 425000,
  weekly: 3135000,
  monthly: 12500000,
};

export const FinancialSummary = ({ summary = DEFAULT_SUMMARY }) => (
  <Card className="shadow-xs flex flex-col justify-between">
    <CardHeader className="pb-2">
      <CardTitle className="text-base font-semibold text-primary-foreground">
        Ringkasan Pendapatan
      </CardTitle>
    </CardHeader>
    <CardContent className="space-y-4 pt-2">
      <div className="flex justify-between items-center pb-2.5 border-b border-border/60">
        <span className="text-xs text-muted-foreground font-medium">Hari ini</span>
        <span className="text-sm font-bold text-secondary">
          Rp {summary.daily?.toLocaleString("id-ID") ?? "0"}
        </span>
      </div>
      <div className="flex justify-between items-center pb-2.5 border-b border-border/60">
        <span className="text-xs text-muted-foreground font-medium">Minggu ini</span>
        <span className="text-sm font-bold text-secondary">
          Rp {summary.weekly?.toLocaleString("id-ID") ?? "0"}
        </span>
      </div>
      <div className="flex justify-between items-center">
        <span className="text-xs text-muted-foreground font-medium">Bulan ini</span>
        <span className="text-sm font-bold text-secondary">
          Rp {summary.monthly?.toLocaleString("id-ID") ?? "0"}
        </span>
      </div>
    </CardContent>
  </Card>
);