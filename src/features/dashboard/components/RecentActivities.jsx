"use client";

import React from "react";
import { Activity, Bell } from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

export default function RecentActivities({ activities = [] }) {
  const formatTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return new Intl.DateTimeFormat("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    }).format(date);
  };

  return (
    <Card className="flex-1 shadow-xs">
      <CardHeader className="pb-3 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Aktivitas Terbaru
            </CardTitle>
            <CardDescription className="text-xs">
              Notifikasi & riwayat sistem harian
            </CardDescription>
          </div>
          <Activity className="size-4 text-muted-foreground" />
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[320px] px-4">
          {activities.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <Bell className="size-8 mx-auto mb-2 opacity-40" />
              <p className="text-xs">Belum ada aktivitas baru hari ini.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-3 py-3">
              {activities.map((item, index) => (
                <React.Fragment key={item.id || index}>
                  <div className="flex items-start justify-between text-xs gap-2">
                    <div className="space-y-0.5">
                      <p className="font-medium text-foreground">
                        {item.title || "Notifikasi"}
                      </p>
                      <p className="text-muted-foreground text-[11px]">
                        {item.message || item.text}
                      </p>
                      <span className="text-[10px] text-muted-foreground block">
                        {formatTime(item.created_at)}
                      </span>
                    </div>
                  </div>
                  {index < activities.length - 1 && <Separator />}
                </React.Fragment>
              ))}
            </div>
          )}
        </ScrollArea>
      </CardContent>
    </Card>
  );
}
