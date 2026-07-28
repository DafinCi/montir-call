"use client";

import React from "react";
import {
  MapPin,
  Clock,
  Car,
  AlertTriangle,
  ChevronRight,
  CheckCircle2,
  Loader2,
  Phone,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function JobRequestCard({
  job,
  onSelect,
  onAccept,
  isAccepting = false,
}) {
  const isEmergency =
    job.priority === "emergency" || job.ai_analysis?.urgency === "CRITICAL";
  const customerName =
    job.customer_name || job.user_name || job.customerName || "Pelanggan";
  const vehicleModel =
    job.vehicle_model || job.vehicle_type || job.vehicleModel || "Kendaraan";
  const problemDesc =
    job.problem_description || job.description || job.problemDescription || "-";

  // Membaca nomor WA dengan fallback yang sama seperti ActiveJobs
  const customerPhone =
    job.customer_phone || job.phone || job.customerPhone || "";

  // Membaca Alamat dengan fallback yang sama seperti ActiveJobs
  const locationText =
    job.location_address ||
    job.address ||
    job.location_title ||
    job.locationAddress ||
    "Lokasi pelanggan";

  return (
    <Card className="group relative overflow-hidden border border-slate-200 bg-white hover:border-slate-300 transition-all shadow-xs">
      <div
        className={`absolute top-0 left-0 bottom-0 w-1 ${
          isEmergency ? "bg-red-500" : "bg-blue-500"
        }`}
      />

      <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex flex-col gap-3">
          {/* Header Row */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium text-slate-400">
                  #{typeof job.id === "string" ? job.id.slice(0, 8) : job.id}
                </span>
                <span className="text-xs text-slate-300">•</span>
                <span className="text-xs font-medium text-slate-500 flex items-center gap-1">
                  <Clock className="size-3" />{" "}
                  {job.createdAt || job.created_at || "Baru saja"}
                </span>
              </div>
              <h3 className="text-base font-semibold text-slate-900 mt-0.5">
                {customerName}
              </h3>
            </div>

            {isEmergency ? (
              <Badge
                variant="destructive"
                className="gap-1 text-[11px] font-semibold animate-pulse"
              >
                <AlertTriangle className="size-3" /> Mogok Darurat
              </Badge>
            ) : (
              <Badge
                variant="secondary"
                className="text-[11px] font-medium bg-blue-50 text-blue-700 border-blue-200"
              >
                Terjadwal
              </Badge>
            )}
          </div>

          {/* Vehicle & Problem Info */}
          <div className="p-3 rounded-lg bg-slate-50 border border-slate-100 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-slate-900">
              <Car className="size-3.5 text-blue-600 shrink-0" />
              <span>{vehicleModel}</span>
            </div>
            <p className="text-slate-600 line-clamp-2 pl-5.5">
              &rdquo;{problemDesc}&rdquo;
            </p>
          </div>

          {/* Location & Phone Info */}
          <div className="flex items-center justify-between text-xs text-slate-500 pt-1 gap-2">
            <div
              className="flex items-center gap-1.5 truncate max-w-[65%]"
              title={locationText}
            >
              <MapPin className="size-3.5 text-red-500 shrink-0" />
              <span className="truncate font-medium text-slate-700">
                {locationText}
              </span>
            </div>
            {customerPhone ? (
              <div className="flex items-center gap-1 font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 text-slate-700 shrink-0">
                <Phone className="size-3 text-emerald-600" />
                {customerPhone}
              </div>
            ) : (
              <span className="text-[10px] text-slate-400 italic">
                No Telp (-)
              </span>
            )}
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-slate-100 mt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSelect(job)}
              className="text-xs text-slate-600 hover:text-slate-900 h-8 px-2 gap-1"
            >
              Detail Lengkap <ChevronRight className="size-3.5" />
            </Button>

            <Button
              type="button"
              size="sm"
              disabled={isAccepting}
              onClick={() => onAccept(job.id)}
              className="text-xs h-8 px-3 font-semibold gap-1.5 bg-slate-900 text-white hover:bg-slate-800 shadow-xs"
            >
              {isAccepting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Menerima...
                </>
              ) : (
                <>
                  <CheckCircle2 className="size-3.5" /> Terima Job
                </>
              )}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
