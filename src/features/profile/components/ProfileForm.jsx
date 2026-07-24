"use client";

import React from "react";
import { User, Phone, Mail, MapPin, Building2, Wallet } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export default function ProfileForm({ formData, onChange }) {
  return (
    <div className="space-y-6">
      {/* Informasi Pribadi */}
      <div className="space-y-4">
        <div className="border-b pb-2">
          <h2 className="text-base font-semibold text-card-foreground">Informasi Kontak & Diri</h2>
          <p className="text-xs text-muted-foreground">Data dasar untuk keperluan komunikasi dengan pelanggan.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="name" className="text-xs font-medium">Nama Lengkap</Label>
            <div className="relative">
              <User className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={onChange}
                className="pl-9 text-xs"
                placeholder="Nama Anda"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="phone" className="text-xs font-medium">Nomor WhatsApp / HP</Label>
            <div className="relative">
              <Phone className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={onChange}
                className="pl-9 text-xs"
                placeholder="08xxxxxxxxxx"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="email" className="text-xs font-medium">Alamat Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                className="pl-9 text-xs"
                placeholder="email@example.com"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Informasi Operasional & Rekening */}
      <div className="space-y-4 pt-2">
        <div className="border-b pb-2">
          <h2 className="text-base font-semibold text-card-foreground">Area Layanan & Rekening</h2>
          <p className="text-xs text-muted-foreground">Lokasi bengkel acuan dan tujuan pencairan hasil servis.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label htmlFor="workshop" className="text-xs font-medium">Nama Bengkel / Pangkalan</Label>
            <div className="relative">
              <Building2 className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="workshop"
                name="workshop"
                value={formData.workshop}
                onChange={onChange}
                className="pl-9 text-xs"
                placeholder="Contoh: Bengkel Motor"
              />
            </div>
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="bankAccount" className="text-xs font-medium">Rekening Bank (Pencairan)</Label>
            <div className="relative">
              <Wallet className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
              <Input
                id="bankAccount"
                name="bankAccount"
                value={formData.bankAccount}
                onChange={onChange}
                className="pl-9 text-xs"
                placeholder="BCA - 1234567890 a.n Dafin"
              />
            </div>
          </div>

          <div className="space-y-1.5 sm:col-span-2">
            <Label htmlFor="address" className="text-xs font-medium">Alamat Utama / Titik Pangkalan</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Textarea
                id="address"
                name="address"
                rows={2}
                value={formData.address}
                onChange={onChange}
                className="pl-9 text-xs resize-none"
                placeholder="Jl. Pemuda No. 45, Semarang Tengah"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}