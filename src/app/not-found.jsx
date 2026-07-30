"use client";

import React from "react";
import Link from "next/link";
import { Rocket, ArrowLeft, Sparkles, Wrench } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center p-4 bg-background text-foreground relative overflow-hidden">
      {/* Background Glow Effect */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 sm:w-96 sm:h-96 bg-primary/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-md w-full text-center space-y-6">
        {/* Icon Badge */}
        <div className="inline-flex items-center justify-center p-4 bg-secondary/5 rounded-full border border-secondary/30 text-secondary mb-2 animate-bounce">
          <Rocket className="size-15 sm:size-20" />
        </div>

        {/* Text Heading */}
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-muted-foreground text-xs font-mono font-medium">
            <Sparkles className="size-3.5 text-secondary" />
            Fitur Dalam Pengembangan
          </div>
          <h1 className="text-5xl sm:text-4xl font-extrabold tracking-tight text-muted">
            Segera Hadir! <br />
            <span className="text-muted-foreground font-semibold text-2xl sm:text-3xl">
              (Coming Soon)
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground max-w-sm mx-auto leading-relaxed pt-1">
            Halaman atau fitur yang Anda tuju sedang kami pengembangan.
            insyallah bila Allah berkehendak maka akan kami menghadirkan
            pengalaman yang lebih baik dari saat ini untuk Anda!
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Button
            asChild
            className="w-full sm:w-auto gap-2 font-semibold shadow-sm"
          >
            <Link href="/dashboard">
              <ArrowLeft className="size-4" />
              Kembali ke Dashboard
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            className="w-full sm:w-auto gap-2 text-xs"
          >
            <Link href="/request">
              <Wrench className="size-3.5" />
              Lihat Permintaan Masuk
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
