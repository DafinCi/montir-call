"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Power,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Wallet,
  Wrench,
  Settings,
  Gauge,
} from "lucide-react";

import { Avatar, AvatarImage, AvatarFallback, Badge } from "@/components/ui";

export default function DashHeader({
  mechanicName = "Montir",
  avatarUrl = null, // Tambahkan ini untuk persiapan foto profil
  status = "OFFLINE",
  onToggleOnline,
  isToggling = false,
  onRefresh,
  isRefreshing = false,
  todayRevenue = 0,
}) {
  const router = useRouter();

  const [showBalance, setShowBalance] = useState(true);

  // Sesuaikan dengan status database ("AVAILABLE", "BUSY", "OFFLINE")
  const isOnline = status === "AVAILABLE";
  const isBusy = status === "BUSY";

  const formatRupiah = (number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(number || 0);
  };

  const getStatusText = () => {
    if (isBusy) return "Sedang Melayani";
    if (isOnline) return "Siap Menerima Job";
    return "Istirahat / Off";
  };

  const getStatusBadgeStyle = () => {
    if (isBusy) return "bg-amber-500/20 text-amber-400 border-amber-400/30";
    if (isOnline)
      return "bg-emerald-500/20 text-emerald-400 border-emerald-400/30";
    return "bg-slate-500/20 text-slate-400 border-slate-400/30";
  };

  const getStatusDotStyle = () => {
    if (isBusy) return "bg-amber-400 animate-pulse";
    if (isOnline) return "bg-emerald-400 animate-pulse";
    return "bg-slate-400";
  };

  return (
    <div className="space-y-4">
      {/* GREETING TOP BAR */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-3">
          <Avatar className="size-12 shadow-sm border-2 border-primary-foreground">
            {avatarUrl && <AvatarImage src={avatarUrl} alt={mechanicName} />}
            <AvatarFallback className="bg-primary-foreground/10 text-primary-foreground font-bold text-lg">
              {mechanicName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg md:text-xl font-extrabold text-primary-foreground tracking-tight line-clamp-1">
                Halo, {mechanicName}!
              </h1>
              <ShieldCheck className="size-4.5 text-blue-500 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Montir Terverifikasi
            </p>
          </div>
        </div>
      </div>

      {/* DANA MAIN BLUE HEADER CARD */}
      <div className="relative overflow-hidden rounded-sm bg-primary text-primary-foreground p-5 md:p-6 shadow-lg border border-primary/20 space-y-5">
        {/* Siluet Ikon Lucide */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden select-none z-0">
          <Wrench className="absolute -top-3 -right-4 size-45 sm:size-52 lg:size-80 text-secondary/[0.1] -rotate-20" />
          <Settings className="absolute top-2/3 -left-6 -translate-y-1/2 size-29 sm:size-56 text-secondary/[0.1] rotate-45" />
          <Gauge className="hidden sm:block sm:absolute top-6 left-1/3 size-24 text-secondary/[0.1] rotate-12" />
        </div>
        {/* Decorative Background Pattern */}
        <div className="absolute -right-10 -bottom-10 size-44 rounded-full bg-white/10 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-white/5 rounded-full blur-xl pointer-events-none" />

        {/* Header Card Top Section */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-primary-foreground/80 uppercase">
              Saldo Pendapatan
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors p-1"
              title={showBalance ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
            >
              {showBalance ? <Eye size={16} /> : <EyeOff size={16} />}
            </button>
          </div>

          <Badge
            variant="outline"
            className={`text-[11px] font-semibold border px-2.5 py-0.5 rounded-full ${getStatusBadgeStyle()}`}
          >
            <span
              className={`size-2 rounded-full mr-1.5 ${getStatusDotStyle()}`}
            />
            {getStatusText()}
          </Badge>
        </div>

        {/* Main Balance Display */}
        <div className="relative z-10 flex items-baseline justify-between">
          <div>
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight transition-all duration-300">
              {showBalance ? formatRupiah(todayRevenue) : "Rp ••••••••"}
            </div>
            <p className="text-[11px] text-primary-foreground/75 mt-1 flex items-center gap-1">
              Akumulasi pendapatan selesai hari ini
            </p>
          </div>
        </div>

        {/* DANA QUICK ACTION BAR (4 Tombol Aksi Khas DANA) */}
        <div className="pt-4 border-t border-primary-foreground/15 grid grid-cols-4 gap-2 relative z-10">
          {/* Toggle Status */}
          <button
            onClick={onToggleOnline}
            disabled={isToggling || isBusy}
            className="flex flex-col items-center gap-2 p-1 rounded-2xl hover:bg-white/10 active:bg-white/20 transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
          >
            <div
              className={`size-11 rounded-2xl flex items-center justify-center shadow-sm transition-transform group-hover:scale-105 group-active:scale-95 ${
                isBusy
                  ? "bg-amber-500 text-white"
                  : isOnline
                    ? "bg-red-500 text-white"
                    : "bg-emerald-500 text-white"
              }`}
            >
              {isToggling ? (
                <Loader2 className="size-5 animate-spin" />
              ) : (
                <Power className="size-5" />
              )}
            </div>
            <span className="text-[11px] font-medium text-primary-foreground/90 text-center leading-tight">
              {isBusy ? "Melayani" : isOnline ? "Matikan" : "Aktifkan"}
            </span>
          </button>

          {/* Tarik Saldo */}
          <button 
            className="flex flex-col items-center gap-2 p-1 rounded-2xl hover:bg-white/10 active:bg-white/20 transition-all group"
            onClick={ () => router.push("/dashboard/payment")}
            >
            <div className="size-11 rounded-2xl  bg-white/20 backdrop-blur-md text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
              <Wallet className="size-5" />
            </div>
            <span className="text-[11px] font-medium text-primary-foreground/90 text-center leading-tight">
              Tarik Saldo
            </span>
          </button>

          {/* Panggilan Aktif */}
          <button 
            className="flex flex-col items-center gap-2 p-1 rounded-2xl hover:bg-white/10 active:bg-white/20 transition-all group"
            onClick={ () => router.push("/dashboard/service")}
            >
            <div className="size-11 rounded-2xl bg-white/20 backdrop-blur-md text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
              <Wrench className="size-5" />
            </div>
            <span className="text-[11px] font-medium text-primary-foreground/90 text-center leading-tight">
              Servis
            </span>
          </button>

          {/* Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex flex-col items-center gap-2 p-1 rounded-2xl hover:bg-white/10 active:bg-white/20 transition-all disabled:opacity-50 group"
          >
            <div className="size-11 rounded-2xl  bg-white/20 backdrop-blur-md text-primary-foreground flex items-center justify-center shadow-sm group-hover:scale-105 group-active:scale-95 transition-transform">
              <RefreshCw
                className={`size-5 ${isRefreshing ? "animate-spin" : ""}`}
              />
            </div>
            <span className="text-[11px] font-medium text-primary-foreground/90 text-center leading-tight">
              Update
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
