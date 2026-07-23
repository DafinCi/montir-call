"use client";

import React from "react";
import { MoreVertical, ArrowUpRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function RecentActivities() {
  return (
    <Card className="flex-1">
      <CardHeader className="flex flex-row items-center justify-between space-y-0">
        <div>
          <CardTitle className="text-base font-semibold">Aktivitas Terbaru</CardTitle>
          <CardDescription>Riwayat transaksi & pekerjaan</CardDescription>
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon-sm">
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Filter Riwayat</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem>Semua Aktivitas</DropdownMenuItem>
            <DropdownMenuItem>Hanya Servis</DropdownMenuItem>
            <DropdownMenuItem>Pencairan Saldo</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </CardHeader>

      <CardContent className="p-0">
        <ScrollArea className="h-[320px] px-6">
          <div className="flex flex-col gap-4 py-2">
            <div className="flex items-start justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">
                  Servis Selesai - Honda Beat
                </p>
                <p className="text-muted-foreground">Pelanggan: Ahmad Dani</p>
                <span className="text-[10px] text-muted-foreground">10:42 WIB</span>
              </div>
              <span className="font-semibold text-secondary">
                +Rp 120.000
              </span>
            </div>

            <Separator />

            <div className="flex items-start justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">
                  Pencairan Saldo Berhasil
                </p>
                <p className="text-muted-foreground">Ke BCA **** 8821</p>
                <span className="text-[10px] text-muted-foreground">08:15 WIB</span>
              </div>
              <span className="font-semibold text-foreground">-Rp 500.000</span>
            </div>

            <Separator />

            <div className="flex items-start justify-between text-xs">
              <div className="space-y-0.5">
                <p className="font-medium text-foreground">
                  Ulasan Bintang 5 diterima ⭐
                </p>
                <p className="text-muted-foreground">&quot;Respon cepat & ramah!&quot;</p>
                <span className="text-[10px] text-muted-foreground">Yesterday</span>
              </div>
            </div>
          </div>
        </ScrollArea>
      </CardContent>

      <CardFooter className="border-t p-3">
        <Button variant="ghost" size="sm" className="w-full text-xs gap-1">
          Lihat Selengkapnya <ArrowUpRight className="size-3" />
        </Button>
      </CardFooter>
    </Card>
  );
}