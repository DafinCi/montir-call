"use client";

import React from "react";
import { Camera, ShieldCheck, Star, MapPin, Wrench } from "lucide-react";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ProfileHeader({ user, onAvatarChange }) {
  return (
    <div className="bg-card text-card-foreground shadow-xs overflow-hidden">
      {/* Top Banner Accent */}
      <div className="h-28 bg-gradient-to-r from-secondary/20 via-emerald-500/10 to-transparent border-b border-border/50" />

      <div className="px-6 pb-6 pt-0">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
          {/* Avatar & Main Info */}
          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
            <div className="relative group">
              <Avatar className="size-24 sm:size-28 border-4 border-card shadow-md">
                <AvatarImage src={user?.avatarUrl || "/placeholder-avatar.jpg"} alt={user?.name} />
                <AvatarFallback className="bg-secondary/10 text-secondary font-bold text-xl">
                  {user?.name?.slice(0, 2).toUpperCase() || "DF"}
                </AvatarFallback>
              </Avatar>
              <label
                htmlFor="avatar-upload"
                className="absolute bottom-1 right-1 p-2 rounded-full bg-primary text-primary-foreground shadow-xs cursor-pointer hover:scale-105 transition-transform"
                title="Ubah Foto Profil"
              >
                <Camera className="size-3.5" />
                <input
                  id="avatar-upload"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={onAvatarChange}
                />
              </label>
            </div>

            <div className="space-y-1 mb-1">
              <div className="flex items-center justify-center sm:justify-start gap-2 flex-wrap">
                <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-card-foreground">
                  {user?.name || "User"}
                </h1>
                <Badge variant="secondary" className="gap-1 text-[11px] font-medium bg-secondary/15 text-secondary-foreground border-secondary/20">
                  <ShieldCheck className="size-3 text-secondary" /> Montir Terverifikasi
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center sm:justify-start gap-1.5">
                <Wrench className="size-3.5 shrink-0" />
                {user?.roleTitle || "Spesialis Injeksion & Kelistrikan Motor"}
              </p>
            </div>
          </div>

          {/* Quick Stat Pill */}
          <div className="flex items-center justify-center gap-4 py-2 px-4 rounded-sm bg-primary border text-xs">
            <div className="text-center sm:text-right">
              <div className="flex items-center justify-center sm:justify-end gap-1 font-bold text-card-foreground">
                <Star className="size-3.5 fill-amber-400 text-amber-400" />
                <span>4.9</span>
              </div>
              <span className="text-[10px] text-muted-foreground">128 Ulasan</span>
            </div>
            <div className="h-6 w-px bg-border" />
            <div className="text-center sm:text-right">
              <div className="font-bold text-card-foreground">142</div>
              <span className="text-[10px] text-muted-foreground">Servis Selesai</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}