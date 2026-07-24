"use client";

import React from "react";
import {
  Wrench,
  MapPin,
  Phone,
  Navigation,
  Car,
  AlertTriangle,
  ShieldAlert,
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
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-bold text-2xl">
              Panggilan Servis Aktif
            </CardTitle>
            <CardDescription className="text-xs">
              Daftar pekerjaan yang sedang berjalan
            </CardDescription>
          </div>
          <Badge variant="secondary" className="font-semibold text-primary">
            {jobs.length} Aktif
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="size-8 mx-auto mb-2 opacity-50" />
            <p className="text-xs">
              Tidak ada panggilan servis aktif saat ini.
            </p>
          </div>
        ) : (
          jobs.map((job) => {
            const ai = job.ai_analysis; // Data AI JSONB dari Groq

            return (
              <div
                key={job.id}
                className="p-4 rounded-sm border bg-card hover:bg-muted/30 transition-colors space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Car className="size-4 text-primary" />
                    <span className="text-xs font-semibold text-foreground">
                      {job.vehicle_type || "Kendaraan"}
                    </span>
                  </div>
                  <Badge
                    className="text-[10px] px-2 py-0.5 capitalize"
                    variant={
                      job.status === "ACCEPTED" ? "secondary" : "default"
                    }
                  >
                    {job.status.replace(/_/g, " ")}
                  </Badge>
                </div>

                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {job.customer_name}{" "}
                    <span className="font-normal text-muted-foreground">
                      • {job.vehicle_model || ""}
                    </span>
                  </p>
                  <p className="text-xs text-destructive font-medium mt-1">
                    🛠️ {job.problem_description}
                  </p>
                </div>

                {/* 🤖 PREVIEW AI PRE-ASSESSMENT (JIKA ADA) */}
                {ai && (
                  <div className="p-2.5 rounded-lg bg-muted/50 border text-xs space-y-1.5">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="flex items-center gap-1 text-primary">
                        🤖 AI Pre-Assessment
                      </span>
                      <span
                        className={`px-1.5 py-0.5 rounded text-[10px] ${
                          ai.urgency === "HIGH" || ai.urgency === "CRITICAL"
                            ? "bg-red-100 text-red-700 font-bold"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        Urgency: {ai.urgency}
                      </span>
                    </div>

                    {ai.recommended_tools?.length > 0 && (
                      <p className="text-[11px] text-muted-foreground">
                        🧰 <strong>Alat Wajib:</strong>{" "}
                        {ai.recommended_tools.join(", ")}
                      </p>
                    )}

                    {ai.safety_warning && (
                      <p className="text-[11px] text-amber-600 flex items-center gap-1">
                        <AlertTriangle className="size-3 shrink-0" />{" "}
                        {ai.safety_warning}
                      </p>
                    )}
                  </div>
                )}

                <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t">
                  <div className="flex items-center gap-1 truncate max-w-[250px]">
                    <MapPin className="size-3 shrink-0 text-primary" />
                    <span className="truncate">Lokasi Pelanggan</span>
                  </div>
                  <span className="font-semibold text-foreground">
                    {job.customer_phone}
                  </span>
                </div>

                {/* Aksi Berdasarkan Transisi Status Real */}
                <div className="flex items-center justify-between pt-2 gap-2">
                  <div className="flex gap-1.5">
                    {job.customer_phone && (
                      <a href={`tel:${job.customer_phone}`}>
                        <Button
                          size="xs"
                          variant="outline"
                          className="gap-1 text-[11px]"
                        >
                          <Phone className="size-3" /> Hubungi
                        </Button>
                      </a>
                    )}
                  </div>

                  {job.status === "ACCEPTED" && (
                    <Button
                      size="xs"
                      disabled={isUpdating}
                      onClick={() => onUpdateStatus(job.id, "ON_THE_WAY")}
                    >
                      Menuju Lokasi
                    </Button>
                  )}
                  {job.status === "ON_THE_WAY" && (
                    <Button
                      size="xs"
                      disabled={isUpdating}
                      onClick={() => onUpdateStatus(job.id, "ARRIVED")}
                    >
                      Sampai di Lokasi
                    </Button>
                  )}
                  {job.status === "ARRIVED" && (
                    <Button
                      size="xs"
                      disabled={isUpdating}
                      className="bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={() => onUpdateStatus(job.id, "COMPLETED")}
                    >
                      Selesaikan Pekerjaan
                    </Button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </CardContent>
    </Card>
  );
}
