"use client";

import React from "react";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Check, Sliders } from "lucide-react";

const ALL_SKILLS = [
  "Servis Ringan / Ganti Oli",
  "Sistem Injeksi & ECU",
  "Perbaikan Kelistrikan & Aki",
  "Tambal & Ganti Ban",
  "Overhaul Mesin (Motor)",
  "Rem & Kaki-kaki",
  "Mogok Darurat 24 Jam",
  "Servis Karburator",
];

export default function ProfileSpecialties({ selectedSkills = [], onToggleSkill, radius, onRadiusChange }) {
  return (
    <div className="space-y-5">
      <div className="border-b pb-2">
        <h2 className="text-base font-semibold text-card-foreground">Keahlian & Layanan</h2>
        <p className="text-xs text-muted-foreground">Pilih spesialisasi perbaikan yang dapat Anda tangani.</p>
      </div>

      {/* Skills Chips */}
      <div className="space-y-2">
        <Label className="text-xs font-medium">Spesialisasi Perbaikan</Label>
        <div className="flex flex-wrap gap-2 pt-1">
          {ALL_SKILLS.map((skill) => {
            const isSelected = selectedSkills.includes(skill);
            return (
              <button
                key={skill}
                type="button"
                onClick={() => onToggleSkill(skill)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium border transition-all ${
                  isSelected
                    ? "bg-secondary/15 text-secondary-foreground border-secondary/30 font-semibold"
                    : "bg-background text-muted-foreground border-border hover:border-primary/40"
                }`}
              >
                {isSelected && <Check className="size-3 text-secondary" />}
                {skill}
              </button>
            );
          })}
        </div>
      </div>

      {/* Radius Layanan */}
      <div className="space-y-2 pt-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="radius" className="text-xs font-medium">Radius Jangkauan Panggilan</Label>
          <span className="text-xs font-bold text-secondary">{radius} KM</span>
        </div>
        <input
          id="radius"
          type="range"
          min="2"
          max="35"
          step="1"
          value={radius}
          onChange={(e) => onRadiusChange(Number(e.target.value))}
          className="w-full accent-emerald-600 cursor-pointer"
        />
        <div className="flex justify-between text-[10px] text-muted-foreground">
          <span>2 KM (Lokal)</span>
          <span>15 KM (Standar)</span>
          <span>35 KM (Maksimal)</span>
        </div>
      </div>
    </div>
  );
}