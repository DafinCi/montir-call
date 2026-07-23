// QuickAction.jsx
"use client";

import React from "react";
import { Wrench, DollarSign, AlertCircle, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";

export default function QuickAction() {
  const actions = [
    { label: "Servis Manual", icon: Wrench, color: "text-secondary" },
    { label: "Tarik Saldo", icon: DollarSign, color: "text-secondary" },
    { label: "Bantuan", icon: AlertCircle, color: "text-secondary" },
    { label: "Performa", icon: Star, color: "text-secondary" },
  ];

  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold">Aksi Cepat</CardTitle>
        <CardDescription className="text-xs">Pintasan operasi harian</CardDescription>
      </CardHeader>
      <CardContent className="grid grid-cols-2 gap-2">
        {actions.map((act, i) => {
          const Icon = act.icon;
          return (
            <Button
              key={i}
              variant="outline"
              className="h-auto flex-col py-3 px-2 gap-1.5 text-xs font-medium hover:border-primary/30"
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