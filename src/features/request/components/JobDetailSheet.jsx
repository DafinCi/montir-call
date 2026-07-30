"use client";

import React from "react";
import {
  AlertTriangle,
  Calendar,
  ShieldAlert,
  Loader2,
  Bot,
  Timer,
  CarFront,
  MessageCircle,
  Navigation,
} from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

// Helper Ekstraksi Nomor Telepon
function getCustomerPhone(job) {
  return job.customer_phone || job.phone || job.customerPhone || "";
}

// Helper Ekstraksi Alamat Teks
function getAddressText(job) {
  return (
    job.location_address ||
    job.address ||
    job.location_title ||
    job.locationAddress ||
    ""
  );
}

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

// Helper WhatsApp URL
function getWhatsAppUrl(phone, customerName, vehicle) {
  if (!phone) return null;
  let cleanNumber = String(phone).replace(/[^0-9]/g, "");
  if (cleanNumber.startsWith("0")) {
    cleanNumber = "62" + cleanNumber.slice(1);
  }
  if (!cleanNumber) return null;

  const text = encodeURIComponent(
    `Halo Kak ${customerName || ""}, saya montir dari ServisMontir. Saya menerima pesanan perbaikan kendaraan ${vehicle || ""}. Bisakah kirimkan patokan lokasi detailnya?`,
  );
  return `https://wa.me/${cleanNumber}?text=${text}`;
}

export default function JobDetailSheet({
  job,
  isOpen,
  onClose,
  onAccept,
  isAccepting = false,
}) {
  if (!job) return null;

  const aiData = job.ai_analysis || job.aiAnalysis;
  const customerPhone = getCustomerPhone(job);
  const customerName =
    job.customer_name || job.user_name || job.customerName || "Pelanggan";
  const vehicleModel =
    job.vehicle_model || job.vehicle_type || job.vehicleModel || "Kendaraan";
  const problemDesc =
    job.problem_description || job.description || job.problemDescription || "-";
  const addressText = getAddressText(job) || "Lokasi Pelanggan";

  const googleMapsUrl = getGoogleMapsUrl(job);
  const waUrl = getWhatsAppUrl(customerPhone, customerName, vehicleModel);

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg overflow-y-auto p-0 flex flex-col justify-between">
        <div className="p-6 space-y-5">
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
            <SheetTitle className="text-xl font-bold text-slate-900">
              {customerName}
            </SheetTitle>
            <SheetDescription className="text-xs flex items-center gap-2">
              <Calendar className="size-3.5" /> Diterima{" "}
              {job.createdAt || job.created_at || "Baru saja"}
            </SheetDescription>
          </SheetHeader>

          {/* Quick Actions (WA & Google Maps) */}
          <div className="grid grid-cols-2 gap-2 pt-1">
            {waUrl ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-emerald-50 border-emerald-200 text-emerald-700 hover:bg-emerald-100 text-xs gap-1.5"
              >
                <a href={waUrl} target="_blank" rel="noopener noreferrer">
                  <MessageCircle className="size-3.5 text-emerald-600" />
                  Chat WhatsApp
                </a>
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 opacity-50 bg-slate-100"
              >
                <MessageCircle className="size-3.5" /> No WA Kosong
              </Button>
            )}

            {googleMapsUrl ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100 text-xs gap-1.5"
              >
                <a
                  href={googleMapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Navigation className="size-3.5 text-blue-600" />
                  Buka Peta
                </a>
              </Button>
            ) : (
              <Button
                disabled
                variant="outline"
                size="sm"
                className="text-xs gap-1.5 opacity-50 bg-slate-100"
              >
                <Navigation className="size-3.5" /> GPS Tidak Ada
              </Button>
            )}
          </div>

          <Separator />

          {/* AI Pre-Assessment */}
          {aiData && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-semibold uppercase tracking-wider text-blue-600 flex items-center gap-1.5">
                  <Bot className="size-4" /> AI Pre-Assessment
                </h4>
                <Badge
                  variant="outline"
                  className="text-[10px] font-mono text-blue-600 border-blue-200 bg-blue-50"
                >
                  {Math.round((aiData.confidence || 0.8) * 100)}% Match
                </Badge>
              </div>

              <div className="p-4 rounded-sm border border-blue-200 bg-blue-50/50 shadow-xs space-y-3">
                <div>
                  <p className="text-xs text-slate-500 font-medium mb-1">
                    Perkiraan Kerusakan
                  </p>
                  <p className="font-semibold text-sm text-slate-900">
                    {aiData.estimated_issue}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-blue-100">
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <Timer className="size-3" /> Durasi
                    </p>
                    <p className="text-xs font-medium text-slate-800">
                      {aiData.estimated_duration_minutes} Menit
                    </p>
                  </div>
                  <div>
                    <p className="text-[10px] text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      <CarFront className="size-3" /> Kondisi
                    </p>
                    <p className="text-xs font-medium text-slate-800">
                      {aiData.driveable ? "Bisa Didorong/Jalan" : "Mogok Total"}
                    </p>
                  </div>
                </div>

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
                          className="text-[10px] bg-white text-slate-800"
                        >
                          {tool}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {aiData.safety_warning && (
                  <div className="mt-2 p-2 rounded-lg bg-amber-100/80 border border-amber-200 text-amber-900 text-xs flex items-start gap-2">
                    <ShieldAlert className="size-3.5 shrink-0 mt-0.5 text-amber-600" />
                    <span>{aiData.safety_warning}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Alamat Pelanggan */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Alamat Lokasi
            </h4>
            <div className="p-3 rounded-sm border bg-slate-50 text-xs font-medium text-slate-800">
              {addressText}
            </div>
          </div>

          {/* Keluhan Pelanggan */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Keluhan Pelanggan
            </h4>
            <div className="p-3.5 rounded-sm border bg-slate-50 text-xs">
              <p className="text-slate-800 leading-relaxed italic">
                &rdquo;{problemDesc}&rdquo;
              </p>
            </div>
          </div>

          {/* Kendaraan */}
          <div className="space-y-1.5">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Kendaraan
            </h4>
            <div className="p-3 rounded-lg border bg-slate-50 text-xs font-semibold text-slate-800">
              {vehicleModel}
            </div>
          </div>
        </div>

        {/* Action Footer */}
        <div className="p-4 border-t bg-white sticky bottom-0 space-y-2">
          <Button
            type="button"
            disabled={isAccepting}
            className="w-full font-semibold gap-2 shadow-xs bg-slate-900 hover:bg-slate-800 text-white"
            onClick={() => onAccept(job.id)}
          >
            {isAccepting ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Memproses Job...
              </>
            ) : (
              <>Terima &amp; Tangani Sekarang</>
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
