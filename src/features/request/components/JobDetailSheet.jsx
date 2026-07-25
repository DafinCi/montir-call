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
              {job.priority === "emergency" ? (
                <Badge variant="destructive" className="gap-1">
                  <AlertTriangle className="size-3" /> Panggilan Darurat
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
              {job.customerName}
            </SheetTitle>
            <SheetDescription className="text-xs flex items-center gap-2">
              <Calendar className="size-3.5" /> Diterima {job.createdAt}
            </SheetDescription>
          </SheetHeader>

          <Separator />

          {/* Location Box */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Lokasi Perbaikan
            </h4>
            <div className="p-3.5 rounded-xl border bg-muted/20 space-y-2">
              <div className="flex items-start gap-2.5">
                <MapPin className="size-4 text-secondary mt-0.5 shrink-0" />
                <div className="text-xs space-y-0.5">
                  <p className="font-semibold text-card-foreground">
                    {job.locationTitle}
                  </p>
                  <p className="text-muted-foreground">{job.locationAddress}</p>
                </div>
              </div>
              <div className="flex items-center justify-between text-xs pt-2 border-t border-border/50 text-muted-foreground">
                <span>Jarak estimasi:</span>
                <span className="font-semibold text-card-foreground">
                  {job.distanceKm} KM ({job.estimatedTime})
                </span>
              </div>
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
                  {job.vehicleModel}
                </span>
              </div>
              <div className="p-3 rounded-lg border bg-card">
                <span className="text-muted-foreground block text-[10px]">
                  Plat Nomor
                </span>
                <span className="font-mono font-semibold text-card-foreground">
                  {job.licensePlate}
                </span>
              </div>
            </div>
          </div>

          {/* Diagnostic Note */}
          <div className="space-y-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Keluhan Utama / Diagnosa
            </h4>
            <div className="p-3.5 rounded-xl border bg-card text-xs space-y-2">
              <p className="text-card-foreground leading-relaxed">
                &rdquo;{job.problemDescription}&rdquo;
              </p>
              {job.symptoms && job.symptoms.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-2 border-t">
                  {job.symptoms.map((symptom, idx) => (
                    <Badge
                      key={idx}
                      variant="outline"
                      className="text-[10px] bg-muted/30"
                    >
                      <Wrench className="size-2.5 mr-1" /> {symptom}
                    </Badge>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Customer Note */}
          {job.customerNote && (
            <div className="p-3 rounded-lg border border-amber-500/20 bg-amber-500/5 text-amber-900 dark:text-amber-200 text-xs flex items-start gap-2">
              <ShieldAlert className="size-4 text-amber-600 shrink-0 mt-0.5" />
              <span>
                <strong>Catatan Pelanggan:</strong> {job.customerNote}
              </span>
            </div>
          )}
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
