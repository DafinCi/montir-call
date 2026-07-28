"use client";

import React, { useState } from "react";
import {
  Power,
  RefreshCw,
  Loader2,
  Eye,
  EyeOff,
  ShieldCheck,
  Wallet,
  Wrench,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui";
import { Badge } from "@/components/ui";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui";

export default function DashHeader({
  mechanicName = "Montir",
  status = "OFFLINE",
  onToggleOnline,
  isToggling = false,
  onRefresh,
  isRefreshing = false,
  todayRevenue = 0,
}) {
  const [showBalance, setShowBalance] = useState(true);

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
    return "istirahat / Off";
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
          <Avatar size="lg">
            {/* Opsional: Tambahkan AvatarImage jika nanti ada URL foto profil */}
            {/* <AvatarImage src={avatarUrl} alt={mechanicName} /> */}
            <AvatarFallback className="bg-secondary/10 text-muted border border-primary/20 font-bold text-base">
              {mechanicName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-1.5">
              <h1 className="text-lg md:text-xl font-extrabold text-muted tracking-tight">
                Halo, {mechanicName}!
              </h1>
              <ShieldCheck className="size-4 text-blue-500" />
            </div>
            <p className="text-xs text-muted-foreground font-medium">
              Montir Terverifikasi
            </p>
          </div>
        </div>
      </div>

      {/* DANA MAIN BLUE HEADER CARD */}
      <div className="relative overflow-hidden rounded-3xl bg-primary text-primary-foreground p-5 md:p-6 shadow-md border border-primary/20 space-y-5">
        {/* Decorative Background Pattern (Khas DANA) */}
        <div className="absolute -right-10 -bottom-10 size-44 rounded-full bg-white/5 blur-2xl pointer-events-none" />
        <div className="absolute top-0 right-1/4 w-32 h-32 bg-secondary/10 rounded-full blur-xl pointer-events-none" />

        {/* Header Card Top Section */}
        <div className="flex items-center justify-between relative z-10">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold tracking-wider text-primary-foreground/80 uppercase">
              Saldo Pendapatan
            </span>
            <button
              onClick={() => setShowBalance(!showBalance)}
              className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
              title={showBalance ? "Sembunyikan Saldo" : "Tampilkan Saldo"}
            >
              {showBalance ? <Eye size={15} /> : <EyeOff size={15} />}
            </button>
          </div>

          <Badge
            variant="outline"
            className={`text-[11px] font-semibold border ${getStatusBadgeStyle()}`}
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
            <div className="text-3xl md:text-4xl font-extrabold tracking-tight">
              {showBalance ? formatRupiah(todayRevenue) : "Rp ••••••••"}
            </div>
            <p className="text-[11px] text-primary-foreground/75 mt-1 flex items-center gap-1">
              Akumulasi estimasi pendapatan hari ini
            </p>
          </div>
        </div>

        {/* DANA QUICK ACTION BAR (4 Tombol Aksi Khas DANA) */}
        <div className="pt-2 border-t border-primary-foreground/15 grid grid-cols-4 gap-2 relative z-10">
          {/* Action 1: Toggle Status */}
          <button
            onClick={onToggleOnline}
            disabled={isToggling || isBusy}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 group"
          >
            <div
              className={`size-10 rounded-2xl flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 ${
                isOnline ? "bg-red-500 text-white" : "bg-emerald-500 text-white"
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

          {/* Action 2: Tarik Saldo */}
          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-all group">
            <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-md text-primary-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Wallet className="size-5" />
            </div>
            <span className="text-[11px] font-medium text-primary-foreground/90 text-center leading-tight">
              Tarik Saldo
            </span>
          </button>

          {/* Action 3: Panggilan Aktif */}
          <button className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-all group">
            <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-md text-primary-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
              <Wrench className="size-5" />
            </div>
            <span className="text-[11px] font-medium text-primary-foreground/90 text-center leading-tight">
              Servis
            </span>
          </button>

          {/* Action 4: Refresh */}
          <button
            onClick={onRefresh}
            disabled={isRefreshing}
            className="flex flex-col items-center gap-1.5 p-2 rounded-xl hover:bg-white/10 transition-all disabled:opacity-50 group"
          >
            <div className="size-10 rounded-2xl bg-white/20 backdrop-blur-md text-primary-foreground flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform">
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
