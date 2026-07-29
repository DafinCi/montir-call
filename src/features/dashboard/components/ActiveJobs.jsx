"use client";

import React, { useState } from "react";
import {
  Wrench,
  MapPin,
  Navigation,
  Car,
  AlertTriangle,
  MessageSquare,
  CheckCircle2,
  Loader2,
  Clock,
  DollarSign,
  X,
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
  const [paymentModal, setPaymentModal] = useState({
    isOpen: false,
    jobId: null,
  });
  const [totalFee, setTotalFee] = useState("");

  // 1. Helper Universal untuk mengurai koordinat GPS dari Supabase (WKB Hex, WKT, GeoJSON, atau Plain Object)
  function extractCoordinates(job) {
    if (!job) return null;

    // A. Cek jika koordinat sudah berbentuk angka langsung
    let lat = job.latitude || job.location_lat || job.lat;
    let lng = job.longitude || job.location_lng || job.lng;
    if (lat && lng) return { lat, lng };

    const location =
      job.customer_location || job.customerLocation || job.location;
    if (!location) return null;

    // B. Jika data lokasi berbentuk String
    if (typeof location === "string") {
      // b1. Format Teks WKT/EWKT (contoh: "POINT(106.827 -6.175)" atau "SRID=4326;POINT(...)")
      const match = location.match(/POINT\s*\(\s*([-\d.]+)\s+([-\d.]+)\s*\)/i);
      if (match) {
        return { lng: match[1], lat: match[2] };
      }

      // b2. Format PostGIS EWKB Hexadecimal (Bawaan default Supabase `select('*')`)
      if (/^[0-9a-fA-F]+$/.test(location) && location.length >= 42) {
        try {
          const bytes = new Uint8Array(
            location.match(/.{1,2}/g).map((byte) => parseInt(byte, 16)),
          );
          const view = new DataView(bytes.buffer);
          const isLittleEndian = bytes[0] === 1;
          const type = view.getUint32(1, isLittleEndian);
          const hasSrid = (type & 0x20000000) !== 0;
          const offset = hasSrid ? 9 : 5;

          const hexLng = view.getFloat64(offset, isLittleEndian);
          const hexLat = view.getFloat64(offset + 8, isLittleEndian);

          if (!isNaN(hexLat) && !isNaN(hexLng)) {
            return { lat: hexLat, lng: hexLng };
          }
        } catch (e) {
          console.error("Gagal mendekode WKB Hex PostGIS:", e);
        }
      }
    }

    // C. Jika data lokasi berbentuk Object / GeoJSON
    if (typeof location === "object") {
      if (
        Array.isArray(location.coordinates) &&
        location.coordinates.length >= 2
      ) {
        return { lng: location.coordinates[0], lat: location.coordinates[1] };
      }
      if (location.lat && location.lng) {
        return { lat: location.lat, lng: location.lng };
      }
    }

    return null;
  }

  // 2. Helper URL Google Maps Utama
  function getGoogleMapsUrl(job) {
    const coords = extractCoordinates(job);

    // Jika koordinat berhasil dibaca -> Buka Mode Navigasi Driving + Trafik Realtime
    if (coords && coords.lat && coords.lng) {
      return `https://www.google.com/maps/dir/?api=1&destination=${coords.lat},${coords.lng}&travelmode=driving`;
    }

    // Fallback: Jika koordinat benar-benar tidak ditemukan, gunakan pencarian alamat teks
    const address = getAddressText(job);
    if (address) {
      return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(address)}`;
    }

    return null;
  }

  const getWhatsAppUrl = (phone) => {
    if (!phone) return "#";
    let cleanNumber = phone.replace(/[^0-9]/g, "");
    if (cleanNumber.startsWith("0")) {
      cleanNumber = "62" + cleanNumber.slice(1);
    }
    return `https://wa.me/${cleanNumber}`;
  };

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

  // Eksekusi Submit Pembayaran (ASYNC & DENGAN ERROR HANDLING)
  const handleCompleteJob = async () => {
    const feeNum = Number(totalFee);
    if (!totalFee || isNaN(feeNum) || feeNum <= 0) {
      alert("Masukkan nominal biaya perbaikan yang valid!");
      return;
    }

    // Kirim secara async ke handler parent
    const res = await onUpdateStatus(paymentModal.jobId, "COMPLETED", {
      totalFee: feeNum,
    });

    // Hanya tutup modal jika proses berhasil
    if (res?.success !== false) {
      setPaymentModal({ isOpen: false, jobId: null });
      setTotalFee("");
    } else {
      alert(res?.error || "Gagal menyelesaikan pekerjaan. Silakan coba lagi.");
    }
  };

  return (
    <>
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
            <div className="text-center py-10 border border-dashed border-border rounded-sm bg-background/50">
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
                  className="p-4 rounded-sm border border-border bg-background hover:border-secondary/50 transition-all space-y-3.5 shadow-2xs"
                >
                  <div className="flex items-center justify-between gap-2 border-b border-border/60 pb-2.5">
                    <div className="flex items-center gap-2">
                      <Car className="size-4 text-secondary shrink-0" />
                      <span className="text-xs font-bold text-card-foreground truncate">
                        {vehicleText}
                      </span>
                    </div>
                    {getStatusBadge(job.status)}
                  </div>

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

                  {ai && (
                    <div className="p-3 rounded-lg bg-accent/40 border border-border text-xs space-y-1.5">
                      <div className="flex items-center justify-between font-semibold">
                        <span className="flex items-center gap-1.5 text-secondary">
                          AI Pre-Assessment
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
                        <p className="text-[11px] text-amber-700 flex items-center gap-1 font-semibold">
                          <AlertTriangle className="size-3 shrink-0" />{" "}
                          {ai.safety_warning}
                        </p>
                      )}
                    </div>
                  )}

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

                  <div className="flex flex-wrap items-center justify-between pt-3 border-t border-border/60 gap-2">
                    <div className="flex items-center gap-1.5">
                      <a
                        href={getGoogleMapsUrl(job)}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        <Button
                          type="button"
                          size="xs"
                          variant="outline"
                          className="gap-1 text-[11px] font-semibold bg-secondary/10 hover:bg-secondary/30 text-secondary border border-secondary/30"
                        >
                          <Navigation className="size-3" /> Peta
                        </Button>
                      </a>

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
                            className="gap-1 text-[11px] font-semibold text-secondary border-secondary/30 bg-secondary/10 hover:bg-secondary/30"
                          >
                            <MessageSquare className="size-3" /> WA
                          </Button>
                        </a>
                      )}
                    </div>

                    <div>
                      {job.status === "ACCEPTED" && (
                        <Button
                          type="button"
                          size="xs"
                          disabled={isUpdating}
                          onClick={() => onUpdateStatus(job.id, "ON_THE_WAY")}
                          className="gap-1.5 font-bold text-[11px] text-primary  shadow-2xs"
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
                          className="gap-1.5 font-bold text-[11px] text-primary shadow-2xs"
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
                          onClick={() =>
                            setPaymentModal({ isOpen: true, jobId: job.id })
                          }
                          className="gap-1.5 font-bold text-[11px] text-primary shadow-2xs"
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

      {/* Modal Input Tagihan */}
      {paymentModal.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4 animate-in fade-in duration-150">
          <div className="bg-card w-full max-w-sm rounded-sm border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-4 border-b border-border flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-card-foreground flex items-center gap-2 text-sm sm:text-base">
                <DollarSign className="size-4 text-secondary" />
                Input Tagihan Servis
              </h3>
              <button
                type="button"
                onClick={() => {
                  setPaymentModal({ isOpen: false, jobId: null });
                  setTotalFee("");
                }}
                className="text-muted-foreground hover:text-foreground transition-colors p-1 rounded-md"
              >
                <X className="size-4" />
              </button>
            </div>

            <div className="p-4 space-y-4">
              <p className="text-xs text-muted-foreground leading-relaxed">
                Masukkan total nominal biaya perbaikan (termasuk biaya jasa
                &amp; sparepart) sebelum memproses penyelesaian pekerjaan ini.
              </p>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-card-foreground">
                  Total Biaya (Rp)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <span className="text-muted-foreground text-sm font-bold">
                      Rp
                    </span>
                  </div>
                  <input
                    type="number"
                    value={totalFee}
                    onChange={(e) => setTotalFee(e.target.value)}
                    placeholder="150000"
                    className="flex text-primary-foreground h-10 w-full rounded-md border border-input bg-background px-3 py-2 pl-10 text-sm font-semibold ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    autoFocus
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-border/60">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setPaymentModal({ isOpen: false, jobId: null });
                    setTotalFee("");
                  }}
                  className="text-xs text-primary-foreground font-semibold"
                >
                  Batal
                </Button>
                <Button
                  type="button"
                  size="sm"
                  onClick={handleCompleteJob}
                  disabled={!totalFee || isUpdating}
                  className=" font-bold text-xs gap-1.5"
                >
                  {isUpdating && <Loader2 className="size-3.5 animate-spin" />}
                  Simpan &amp; Selesaikan
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
