"use client";

import React from "react";
import {
  Wrench,
  MapPin,
  Phone,
  Navigation,
  Car,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Clock,
} from "lucide-react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActiveJobs({ jobs = [], onUpdateStatus, isUpdating }) {
  // Helper membuat Link Google Maps Navigasi
  const getGoogleMapsUrl = (job) => {
    const lat = job.latitude || job.location_lat || job.lat;
    const lng = job.longitude || job.location_lng || job.lng;
    const address =
      job.location_address || job.address || job.location_title || "";

    if (lat && lng) {
      return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    }
    return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
  };

  // Helper format WhatsApp
  const getWhatsAppUrl = (phone) => {
    if (!phone) return "#";
    let cleanNumber = phone.replace(/[^0-9]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.slice(1);
    }
    return `https://wa.me/${cleanNumber}`;
  };

  // Helper Badge Status dengan Kontras Jelas
  const getStatusBadge = (status) => {
    switch (status) {
      case "ACCEPTED":
        return (
          <Badge
            variant="outline"
            className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-500/30 text-[10px] font-semibold"
          >
            <Clock className="size-3 mr-1" /> Pesanan Diterima
          </Badge>
        );
      case "ON_THE_WAY":
        return (
          <Badge
            variant="outline"
            className="bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/30 text-[10px] font-semibold animate-pulse"
          >
            <Navigation className="size-3 mr-1" /> Dalam Perjalanan
          </Badge>
        );
      case "ARRIVED":
        return (
          <Badge
            variant="outline"
            className="bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-emerald-500/30 text-[10px] font-semibold"
          >
            <MapPin className="size-3 mr-1" /> Sampai di Lokasi
          </Badge>
        );
      default:
        return (
          <Badge variant="outline" className="text-[10px] font-medium">
            {status}
          </Badge>
        );
    }
  };

  return (
    <Card className="bg-card text-card-foreground border-border shadow-xs">
      <CardHeader className="pb-4 border-b border-border">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-bold text-xl sm:text-2xl text-card-foreground flex items-center gap-2">
              <Wrench className="size-5 text-secondary" /> Panggilan Servis
              Aktif
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Kelola pekerjaan yang sedang Anda tangani secara real-time.
            </CardDescription>
          </div>
          <Badge
            variant="secondary"
            className="font-semibold text-secondary-foreground bg-secondary/15 border border-secondary/30"
          >
            {jobs.length} Aktif
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-10 border border-dashed border-border rounded-xl bg-background/50">
            <Wrench className="size-8 mx-auto mb-2 text-muted-foreground opacity-60" />
            <p className="text-xs font-semibold text-card-foreground">
              Tidak ada panggilan servis aktif saat ini.
            </p>
            <p className="text-[11px] text-muted-foreground mt-1">
              Ambil pesanan baru di menu Permintaan Masuk.
            </p>
          </div>
        ) : (
          jobs.map((job) => {
            const ai = job.ai_analysis;
            const customerPhone = job.customer_phone || job.phone || "";
            const addressText =
              job.location_address ||
              job.address ||
              job.location_title ||
              "Lokasi pelanggan";
            const vehicleText = `${
              job.vehicle_model || job.vehicle_type || "Kendaraan"
            } ${job.license_plate ? `(${job.license_plate})` : ""}`;

            return (
              <div
                key={job.id}
                className="p-4 rounded-xl border border-border bg-background hover:border-secondary/50 transition-all space-y-3.5 shadow-2xs"
              >
                {/* Header Card Status */}
                <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Car className="size-4 text-secondary shrink-0" />
                    <span className="text-xs font-bold text-card-foreground truncate">
                      {vehicleText}
                    </span>
                  </div>
                  {getStatusBadge(job.status)}
                </div>

                {/* Pelanggan & Masalah */}
                <div className="space-y-1.5">
                  <p className="text-sm font-bold text-card-foreground">
                    {job.customer_name || job.user_name || "Pelanggan"}
                  </p>
                  <p className="text-xs text-destructive font-medium leading-relaxed bg-destructive/10 p-2.5 rounded-lg border border-destructive/20">
                    🛠️ &rdquo;
                    {job.problem_description ||
                      job.description ||
                      "Tidak ada rincian keluhan"}
                    &rdquo;
                  </p>
                </div>

                {/* AI PRE-ASSESSMENT (JIKA ADA) */}
                {ai && (
                  <div className="p-3 rounded-lg bg-accent/40 border border-border text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1.5 text-secondary">
                        🤖 AI Pre-Assessment
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                          ai.urgency === "HIGH" || ai.urgency === "CRITICAL"
                            ? "bg-red-500/20 text-red-700 dark:text-red-300 border border-red-500/30"
                            : "bg-blue-500/20 text-blue-700 dark:text-blue-300 border border-blue-500/30"
                        }`}
                      >
                        Urgency: {ai.urgency}
                      </span>
                    </div>

                    {ai.recommended_tools?.length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        🧰{" "}
                        <strong className="text-card-foreground">
                          Alat Wajib:
                        </strong>{" "}
                        {ai.recommended_tools.join(", ")}
                      </p>
                    )}

                    {ai.safety_warning && (
                      <p className="text-[11px] text-amber-700 dark:text-amber-400 flex items-center gap-1 font-semibold">
                        <AlertTriangle className="size-3 shrink-0" />{" "}
                        {ai.safety_warning}
                      </p>
                    )}
                  </div>
                )}

                {/* Info Alamat & Kontak */}
                <div className="flex items-start justify-between text-xs text-muted-foreground pt-1 gap-2">
                  <div className="flex items-start gap-1.5 truncate max-w-[70%]">
                    <MapPin className="size-3.5 shrink-0 text-secondary mt-0.5" />
                    <span className="truncate text-card-foreground/90 font-medium">
                      {addressText}
                    </span>
                  </div>
                  {customerPhone && (
                    <span className="font-mono font-bold text-card-foreground shrink-0 text-[11px]">
                      {customerPhone}
                    </span>
                  )}
                </div>

                {/* BARIS AKSI TERPADU */}
                <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border/60 gap-2">
                  {/* Grup Tombol Komunikasi & Navigasi */}
                  <div className="flex items-center gap-1.5">
                    {/* Maps */}
                    <a
                      href={getGoogleMapsUrl(job)}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Button
                        type="button"
                        size="xs"
                        variant="secondary"
                        className="gap-1 text-[11px] font-semibold bg-secondary/20 hover:bg-secondary/30 text-secondary-foreground border border-secondary/30"
                      >
                        <Navigation className="size-3" /> Peta
                      </Button>
                    </a>

                    {/* WhatsApp */}
                    {customerPhone && (
                      <a
                        href={getWhatsAppUrl(customerPhone)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          className="gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 border-emerald-500/40 bg-emerald-500/10 hover:bg-emerald-500/20"
                        >
                          <MessageSquare className="size-3" /> WA
                        </Button>
                      </a>
                    )}

                    {/* Telepon Direct */}
                    {customerPhone && (
                      <a href={`tel:${customerPhone}`}>
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          className="gap-1 text-[11px] font-semibold text-card-foreground bg-card hover:bg-accent"
                        >
                          <Phone className="size-3" /> Telp
                        </Button>
                      </a>
                    )}
                  </div>

                  {/* Tombol Eksekusi Status */}
                  <div>
                    {job.status === "ACCEPTED" && (
                      <Button
                        type="button"
                        size="xs"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(job.id, "ON_THE_WAY")}
                        className="gap-1.5 font-bold text-[11px] bg-secondary text-secondary-foreground hover:bg-secondary/90 shadow-2xs"
                      >
                        {isUpdating ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <Navigation className="size-3" />
                        )}
                        Menuju Lokasi
                      </Button>
                    )}

                    {job.status === "ON_THE_WAY" && (
                      <Button
                        type="button"
                        size="xs"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(job.id, "ARRIVED")}
                        className="gap-1.5 font-bold text-[11px] bg-blue-600 hover:bg-blue-700 text-white shadow-2xs"
                      >
                        {isUpdating ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <MapPin className="size-3" />
                        )}
                        Sampai di Lokasi
                      </Button>
                    )}

                    {job.status === "ARRIVED" && (
                      <Button
                        type="button"
                        size="xs"
                        disabled={isUpdating}
                        onClick={() => onUpdateStatus(job.id, "COMPLETED")}
                        className="gap-1.5 font-bold text-[11px] bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs"
                      >
                        {isUpdating ? (
                          <Loader2 className="size-3 animate-spin" />
                        ) : (
                          <CheckCircle2 className="size-3" />
                        )}
                        Selesaikan Pekerjaan
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
