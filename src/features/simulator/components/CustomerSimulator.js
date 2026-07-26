"use client";

import React, { useState, useEffect } from "react";
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
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

export default function CustomerSimulator() {
  const [isOpen, setIsOpen] = useState(false);
  const [requestData, setRequestData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
          setRequestData(payload.new);
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [requestData?.id, supabase]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = {
      customer_name: e.target.name.value,
      vehicle_type: "Mobil",
      vehicle_model: e.target.vehicle.value,
      problem_description: e.target.problem.value,
    };

    const res = await createSimulatedRequest(formData);
    if (res.success) {
      setRequestData(res.data);
    } else {
      alert("Gagal membuat pesanan simulasi.");
    }

    setIsSubmitting(false);
  };

  const resetSimulator = () => {
    setRequestData(null);
  };

  const renderScreen = () => {
    if (!requestData) {
      return (
        <form
          onSubmit={handleSubmit}
          className="flex flex-col h-full space-y-4 p-5 text-slate-900 bg-white"
        >
          <div className="text-center mb-4">
            <h3 className="font-bold text-xl tracking-tight text-slate-900">
              Customer App
            </h3>
            <p className="text-xs font-medium text-slate-500">
              Panggil montir darurat sekarang
            </p>
          </div>
          <div className="space-y-4 flex-1">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Nama Anda
              </label>
              {/* Force border, bg, and text color to override global theme */}
              <Input
                name="name"
                placeholder="Budi Santoso"
                required
                className="text-sm bg-slate-50 border border-slate-300 focus-visible:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Kendaraan
              </label>
              <Input
                name="vehicle"
                placeholder="Honda Brio 2020"
                required
                className="text-sm bg-slate-50 border border-slate-300 focus-visible:ring-blue-500 text-slate-900 placeholder:text-slate-400"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">
                Keluhan
              </label>
              <Textarea
                name="problem"
                placeholder="Mesin tiba-tiba mati saat jalan..."
                required
                className="text-sm bg-slate-50 border border-slate-300 focus-visible:ring-blue-500 resize-none text-slate-900 placeholder:text-slate-400"
                rows={4}
              />
            </div>
          </div>
          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-md py-6 rounded-xl border-none"
          >
            {isSubmitting ? (
              <Loader2 className="size-5 animate-spin text-white" />
            ) : (
              "Pesan Montir"
            )}
          </Button>
        </form>
      );
    }

    const { status } = requestData;

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
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
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
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
              Montir sedang dalam perjalanan menuju lokasi Anda. Mohon tunggu.
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
            <p className="text-sm text-slate-500 mt-2 leading-relaxed">
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
            <p className="text-sm text-slate-500 mt-2">
              Kendaraan Anda sudah siap digunakan.
            </p>
          </div>

          <div className="w-full bg-slate-50 p-4 rounded-xl border border-slate-200 mt-2 shadow-sm text-left">
            <p className="text-xs text-slate-500 mb-1 font-semibold uppercase tracking-wider">
              Total Biaya
            </p>
            <p className="text-2xl font-bold flex items-center gap-2 text-slate-900">
              <CreditCard className="size-6 text-emerald-600" /> Rp 150.000
            </p>
          </div>

          <Button
            onClick={resetSimulator}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold py-6 rounded-xl mt-4 shadow-md border-none"
          >
            Selesai & Tutup
          </Button>
        </div>
      );
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-end">
      {isOpen && (
        <div className="w-[340px] h-[640px] bg-white border-[6px] border-slate-900 rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col mb-4 relative ring-1 ring-black/10">
          {/* Top Notch (Aesthetic HP) */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-36 h-7 bg-slate-900 rounded-b-3xl z-10"></div>

          {/* Screen Body */}
          <div className="flex-1 mt-7 overflow-y-auto bg-white">
            {renderScreen()}
          </div>

          {/* Home Indicator line */}
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-1/3 h-1 bg-slate-300 rounded-full z-10"></div>
        </div>
      )}

      {/* Floating Button */}
      <Button
        onClick={() => setIsOpen(!isOpen)}
        size="icon"
        className={`size-16 rounded-full shadow-2xl transition-all duration-300 border-2 border-white/20 hover:scale-105 active:scale-95 ${isOpen ? "bg-slate-800 hover:bg-slate-900" : "bg-blue-600 hover:bg-blue-700"}`}
      >
        {isOpen ? (
          <X className="size-7 text-white" />
        ) : (
          <Smartphone className="size-7 text-white" />
        )}
      </Button>
    </div>
  );
}
