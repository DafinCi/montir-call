"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { createClient } from "@/lib/supabase/client";
import { createSimulatedRequest } from "../services/simulator.action";
import {
  Smartphone,
  X,
  MapPin,
  Wrench,
  Loader2,
  CheckCircle2,
  Car,
  CreditCard,
  Phone,
  Navigation,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CustomerSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  // State Lokasi (Default Monas Jakarta jika GPS tidak diizinkan)
  const [location, setLocation] = useState({
    lat: -6.175392,
    lng: 106.827153,
    address: "Monas, Jakarta Pusat (Default)",
  });

  const supabase = createClient();

  useEffect(() => {
    if (!requestData?.id) return;

    const channel = supabase
      .channel(`simulator-${requestData.id}`)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "service_requests",
          filter: `id=eq.${requestData.id}`,
        },
        (payload) => {
          setRequestData((prev) => ({
            ...prev,
            ...payload.new,
          }));
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestData?.id, supabase]);

  // Fungsi Ambil Lokasi Presisi Browser (GPS)
// 1. Ambil lokasi presisi + Konversi Alamat Otomatis (Nominatim OSM)
const handleGetLocation = () => {
  if (!navigator.geolocation) {
    alert("Browser Anda tidak mendukung Geolocation");
    return;
  }

  setIsLocating(true);
  navigator.geolocation.getCurrentPosition(
    async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        // Ambil teks nama jalan/alamat dari koordinat GPS (Gratis)
        const res = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await res.json();
        const addressText = data.display_name || `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)}`;

        setLocation({
          lat: latitude,
          lng: longitude,
          address: addressText,
        });
      } catch (err) {
        setLocation({
          lat: latitude,
          lng: longitude,
          address: `Lat: ${latitude.toFixed(4)}, Lng: ${longitude.toFixed(4)} (GPS Aktif)`,
        });
      } finally {
        setIsLocating(false);
      }
    },
    (error) => {
      console.error("Gagal mengambil GPS:", error.message);
      alert("Gagal mengakses GPS. Menggunakan lokasi default.");
      setIsLocating(false);
    },
    { enableHighAccuracy: true, timeout: 10000 }
  );
};

// 2. Submit data ke Server Action
const handleSubmit = async (e) => {
  e.preventDefault();
  setIsSubmitting(true);

  const formData = {
    customer_name: e.target.name.value,
    customer_phone: e.target.phone.value,
    vehicle_type: "Mobil",
    vehicle_model: e.target.vehicle.value,
    problem_description: e.target.problem.value,
    latitude: location.lat,
    longitude: location.lng,
    address: location.address,
  };

  const res = await createSimulatedRequest(formData);
  if (res.success) {
    setRequestData(res.data);
  } else {
    alert("Gagal membuat pesanan simulasi: " + res.error);
  }

  setIsSubmitting(false);
};

  const resetSimulator = () => {
    setRequestData(null);
  };

  const formatRupiah = (amount) => {
    const numericAmount = Number(amount);
    if (!amount || isNaN(numericAmount)) return "Rp 0";

    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(numericAmount);
  };

  const renderScreen = () => {
    if (!requestData) {
      return (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full space-y-3.5 p-4 text-slate-900 bg-white text-xs"
        >
          <div className="text-center mb-1">
            <h3 className="font-bold text-base tracking-tight text-slate-900">
              Customer App
            </h3>
            <p className="text-[11px] font-medium text-slate-500">
              Panggil montir darurat sekarang
            </p>
          </div>

          <div className="space-y-3 flex-1 overflow-y-auto pr-1">
            {/* Input Nama */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                Nama Anda
              </label>
              <Input
                name="name"
                placeholder="Budi Santoso"
                required
                className="h-8 text-xs bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Input WA */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                Nomor WhatsApp
              </label>
              <div className="relative">
                <Phone className="size-3.5 absolute left-2.5 top-2.5 text-slate-400" />
                <Input
                  name="phone"
                  type="tel"
                  placeholder="081234567890"
                  required
                  className="h-8 text-xs pl-8 bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
                />
              </div>
            </div>

            {/* Input Kendaraan */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                Kendaraan
              </label>
              <Input
                name="vehicle"
                placeholder="Honda Brio 2020"
                required
                className="h-8 text-xs bg-slate-50 border-slate-300 text-slate-900 placeholder:text-slate-400"
              />
            </div>

            {/* Input Lokasi / GPS */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                Lokasi Anda
              </label>
              <div className="flex gap-1.5">
                <div className="flex-1 truncate bg-slate-100 border border-slate-200 rounded-md px-2.5 py-1.5 text-[11px] text-slate-600 flex items-center gap-1">
                  <MapPin className="size-3 text-red-500 shrink-0" />
                  <span className="truncate">{location.address}</span>
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={handleGetLocation}
                  disabled={isLocating}
                  className="h-8 px-2 text-[10px] gap-1 shrink-0 bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100"
                >
                  {isLocating ? (
                    <Loader2 className="size-3 animate-spin" />
                  ) : (
                    <Navigation className="size-3" />
                  )}
                  GPS
                </Button>
              </div>
            </div>

            {/* Input Keluhan */}
            <div className="space-y-1">
              <label className="font-bold text-slate-700 uppercase tracking-wide text-[10px]">
                Keluhan
              </label>
              <Textarea
                name="problem"
                placeholder="Mesin mati saat jalan..."
                required
                className="text-xs bg-slate-50 border-slate-300 resize-none text-slate-900 placeholder:text-slate-400 min-h-[70px]"
                rows={3}
              />
            </div>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full text-white font-semibold shadow-md py-5 rounded-xl border-none bg-blue-600 hover:bg-blue-700 text-xs shrink-0"
          >
            {isSubmitting ? (
              <Loader2 className="size-4 animate-spin text-white" />
            ) : (
              "Pesan Montir Sekarang"
            )}
          </Button>
        </form>
      );
    }

    const { status, total_fee } = requestData;

    if (status === "PENDING") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-5 text-slate-900 bg-white">
          <div className="relative flex items-center justify-center">
            <div className="absolute size-28 bg-blue-500/20 rounded-full animate-ping"></div>
            <div className="absolute size-20 bg-blue-500/40 rounded-full animate-pulse"></div>
            <MapPin className="size-12 text-blue-600 z-10" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">
              Mencari Montir...
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Sistem sedang mencari montir terdekat dari lokasi Anda.
            </p>
          </div>
        </div>
      );
    }

    if (status === "ACCEPTED" || status === "ON_THE_WAY") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-5 text-slate-900 bg-white">
          <div className="p-4 bg-amber-100 rounded-full">
            <Car className="size-14 text-amber-600 animate-bounce" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">
              Montir Ditemukan!
            </h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Montir sedang dalam perjalanan menuju lokasi Anda.
            </p>
          </div>
        </div>
      );
    }

    if (status === "ARRIVED") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-5 text-slate-900 bg-white">
          <div className="p-4 bg-indigo-100 rounded-full">
            <Wrench className="size-14 text-indigo-600 animate-pulse" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">Montir Tiba</h3>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Kendaraan Anda sedang dalam proses pengecekan dan perbaikan.
            </p>
          </div>
        </div>
      );
    }

    if (status === "COMPLETED") {
      return (
        <div className="flex flex-col items-center justify-center h-full p-6 text-center space-y-5 text-slate-900 bg-white">
          <div className="p-4 bg-emerald-100 rounded-full">
            <CheckCircle2 className="size-14 text-emerald-600" />
          </div>
          <div>
            <h3 className="font-bold text-xl text-slate-900">
              Servis Selesai!
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Kendaraan Anda siap digunakan.
            </p>
          </div>

          <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 shadow-xs text-left">
            <p className="text-[10px] text-slate-500 mb-1 font-semibold uppercase tracking-wider">
              Total Biaya
            </p>
            <p className="text-xl font-bold flex items-center gap-2 text-slate-900">
              <CreditCard className="size-5 text-emerald-600" />
              {formatRupiah(total_fee)}
            </p>
          </div>

          <Button
            onClick={resetSimulator}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-5 rounded-xl text-xs shadow-md border-none"
          >
            Selesai &amp; Tutup
          </Button>
        </div>
      );
    }
  };

  return (
    <motion.div
      drag
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-[100] flex items-end gap-4"
    >
      {isOpen && (
        <div className="w-[340px] h-[600px] bg-white border-[6px] border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col relative ring-1 ring-black/10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-10"></div>
          <div className="flex-1 mt-7 overflow-y-auto bg-white">
            {renderScreen()}
          </div>
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full z-10"></div>
        </div>
      )}

      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`size-14 rounded-full shadow-2xl transition-all duration-300 border-2 border-white/20 hover:scale-105 active:scale-95 ${
          isOpen
            ? "bg-slate-800 hover:bg-slate-900"
            : "bg-blue-600 hover:bg-blue-700"
        }`}
      >
        {isOpen ? (
          <X className="size-6 text-white" />
        ) : (
          <Smartphone className="size-6 text-white" />
        )}
      </Button>
    </motion.div>
  );
}
