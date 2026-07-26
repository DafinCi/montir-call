"use client";

import React from "react";
import {
  MapPin,
  Wrench,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  ShieldAlert,
  Loader2,
  Bot,
  Sparkles,
  Timer,
  CarFront,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

export default function JobDetailSheet({
  job,
  isOpen,
  onClose,
  onAccept,
  isAccepting = false,
}) {
  if (!job) return null;

  // Cek apakah data AI Analysis tersedia (handle format snake_case dari DB atau camelCase dari mapper)
  const aiData = job.ai_analysis || job.aiAnalysis;

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0 flex flex-col justify-between">
        <div className="p-6 space-y-6">
          {/* Header */}
          <SheetHeader className="text-left space-y-2">
            <div className="flex items-center justify-between gap-2">
              <span className="text-xs font-mono font-medium text-muted-foreground">
                ID Panggilan: #
                {typeof job.id === "string" ? job.id.slice(0, 8) : job.id}
              </span>
              {job.priority === "emergency" ||
              aiData?.urgency === "CRITICAL" ? (
                <Badge variant="destructive" className="gap-1 animate-pulse">
                  <AlertTriangle className="size-3" /> Darurat
                </Badge>
              ) : (
                <Badge
                  variant="secondary"
                  className="bg-secondary/15 text-secondary-foreground border-secondary/20"
                >
                  Terjadwal
                </Badge>
              )}
            </div>
            <SheetTitle className="text-xl font-bold">
              {job.customerName || job.customer_name}
            </SheetTitle>
            <SheetDescription className="text-xs flex items-center gap-2">
              <Calendar className="size-3.5" /> Diterima{" "}
              {job.createdAt || "Baru saja"}
            </SheetDescription>
          </SheetHeader>

          <Separator />

          {/* AI Pre-Assessment Box (Hanya Tampil Jika AI Berhasil Menganalisis) */}
          {aiData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center gap-1.5">
                  <Bot className="size-4" /> AI Pre-Assessment
                </h4>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono text-blue-600 border-blue-200 bg-blue-50"
                >
                  <Sparkles className="size-3 mr-1" />{" "}
                  {Math.round(aiData.confidence * 100)}% Match
                </Badge>
              </div>

              <div className="p-4 rounded-xl border border-blue-200 bg-blue-50/50 dark:bg-blue-950/20 dark:border-blue-900 shadow-sm space-y-3">
                {/* Diagnosa AI */}
                <div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mb-1">
                    Perkiraan Kerusakan
                  </p>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">
                    {aiData.estimated_issue}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100 dark:border-blue-900">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Timer className="size-3" /> Durasi
                    </p>
                    <p className="text-xs font-medium">
                      {aiData.estimated_duration_minutes} Menit
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CarFront className="size-3" /> Kondisi
                    </p>
                    <p className="text-xs font-medium">
                      {aiData.driveable ? "Bisa Didorong/Jalan" : "Mogok Total"}
                    </p>
                  </div>
                </div>

                {/* Persiapan Tools */}
                {aiData.recommended_tools?.length > 0 && (
                  <div className="pt-2">
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1.5">
                      Rekomendasi Alat
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {aiData.recommended_tools.map((tool, idx) => (
                        <Badge
                          key={idx}
                          variant="secondary"
                          className="text-[10px] bg-white dark:bg-slate-800"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {/* Safety Warning */}
                {aiData.safety_warning && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-100/50 border border-amber-200 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
                    <ShieldAlert className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>{aiData.safety_warning}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Diagnostic Note (Keluhan Asli) */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Keluhan Asli Pelanggan
            </h4>
            <div className="p-3.5 rounded-xl border bg-card text-xs space-y-2">
              <p className="text-card-foreground leading-relaxed italic">
                &rdquo;{job.problemDescription || job.problem_description}
                &rdquo;
              </p>
            </div>
          </div>

          {/* Vehicle Info */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Kendaraan Pelanggan
            </h4>
            <div className="grid grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-muted-foreground block text-[10px]">
                  Tipe Kendaraan
                </span>
                <span className="font-semibold text-card-foreground">
                  {job.vehicleModel || job.vehicle_model}
                </span>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-muted-foreground block text-[10px]">
                  Plat Nomor
                </span>
                <span className="font-mono font-semibold text-card-foreground">
                  {job.licensePlate || "-"}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t bg-card sticky bottom-0 space-y-2">
          <Button
            type="button"
            disabled={isAccepting}
            className="w-full font-semibold gap-2 shadow-xs"
            onClick={() => onAccept(job.id)}
          >
            {isAccepting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Memproses Job...
              </>
            ) : (
              <>
                <CheckCircle2 className="size-4" /> Terima & Tangani Sekarang
              </>
            )}
          </Button>
          <Button
            type="button"
            variant="outline"
            className="w-full text-xs"
            onClick={onClose}
          >
            Tutup
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
