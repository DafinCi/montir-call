"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Wrench, ArrowLeft, LayoutDashboard } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  const router = useRouter();

  return (
    <main className="min-h-dvh w-full bg-background flex items-center justify-center p-4 sm:p-6">
      <div className="w-full max-w-md bg-card border border-border rounded-2xl p-6 sm:p-8 shadow-xs text-center space-y-6">
        <div className="flex justify-center">
          <div className="size-12 rounded-2xl bg-primary border border-border/80 flex items-center justify-center text-foreground">
            <Wrench className="size-5" />
          </div>
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-medium bg-primary text-muted-foreground border border-border/60">
            <span className="size-1.5 rounded-full bg-muted-foreground/60" />
            Dalam Tahap Pengembangan
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight pt-1">
            Fitur Segera Hadir
          </h1>

          <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-xs mx-auto">
            Halaman ini sedang kami persiapkan untuk melengkapi sistem
            perbengkelan kamu. Mohon tunggu pembaruan mendatang.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center gap-2 pt-2">
          <Button
            variant="outline"
            onClick={() => router.back()}
            className="w-full sm:w-1/2 h-10 text-xs font-medium gap-2 rounded-xl"
          >
            <ArrowLeft className="size-3.5" />
            Kembali
          </Button>

          <Button
            asChild
            className="w-full sm:w-1/2 h-10 text-xs font-medium gap-2 rounded-xl"
          >
            <Link href="/dashboard">
              <LayoutDashboard className="size-3.5" />
              Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </main>
  );
}
