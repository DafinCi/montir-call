"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Wrench, Wallet, HelpCircle, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";

export default function QuickAction() {
  const router = useRouter();

  const actions = [
    {
      label: "Servis Manual",
      icon: Wrench,
      color: "text-secondary",
      onClick: () => router.push("/dashboard/services/new"),
    },
    {
      label: "Tarik Saldo",
      icon: Wallet,
      color: "text-secondary",
      onClick: () => router.push("/dashboard/finance/withdraw"),
    },
    {
      label: "Performa",
      icon: TrendingUp,
      color: "text-secondary",
      onClick: () => router.push("/dashboard/analytics"),
    },
    {
      label: "Bantuan",
      icon: HelpCircle,
      color: "text-secondary",
      onClick: () => router.push("/dashboard/support"),
    },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-muted">
          Aksi Cepat
        </CardTitle>
        <CardDescription className="text-xs">
          Pintasan navigasi harian
        </CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <Button
              key={i}
              variant="outline"
              onClick={act.onClick}
              className="h-auto flex-col py-3 px-2 gap-1.5 text-xs font-medium hover:border-primary/40 hover:bg-muted/50 transition-all"
            >
              <Icon className={`size-4 ${act.color}`} />
              {act.label}
            </Button>
          );
        })}
      </CardContent>
    </Card>
  );
}
