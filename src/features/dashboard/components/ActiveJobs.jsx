"use client";

import React from "react";
import { Wrench, MapPin, Phone, Navigation, Car } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function ActiveJobs({ jobs = [], onUpdateStatus }) {
  return (
    <Card className="shadow-xs">
      <CardHeader className="pb-4 border-b">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="font-bold text-2xl">Panggilan Servis</CardTitle>
            <CardDescription className="text-xs">
              Permintaan service darurat
            </CardDescription>
          </div>
          <Badge variant="secondary" className="font-semibold text-primary">
            {jobs.length} Tugas
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-3">
        {jobs.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <Wrench className="size-8 mx-auto mb-2" />
            <p className="text-xs">Tidak ada panggilan servis aktif saat ini.</p>
          </div>
        ) : (
          jobs.map((job) => (
            <div
              key={job.id}
              className="p-4 rounded-xl border bg-muted/20 hover:bg-muted/40 transition-colors space-y-3"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Car className="size-4 text-primary-foreground" />
                  <span className="text-xs font-semibold text-foreground">{job.id}</span>
                </div>
                <Badge
                  variant={
                    job.status === "pending"
                      ? "destructive"
                      : job.status === "in_progress"
                      ? "secondary"
                      : "default"
                  }
                  className="text-[10px] px-2 py-0.5 capitalize"
                >
                  {job.status.replace("_", " ")}
                </Badge>
              </div>

              <div>
                <p className="text-sm font-semibold text-foreground">
                  {job.customer} <span className="font-normal text-muted-foreground">• {job.vehicle}</span>
                </p>
                <p className="text-xs text-destructive font-medium mt-0.5">🛠️ {job.issue}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/50">
                <div className="flex items-center gap-1 truncate max-w-[220px]">
                  <MapPin className="size-3 shrink-0 text-primary-foreground" />
                  <span className="truncate">{job.location}</span>
                </div>
                <span className="font-bold text-foreground shrink-0">{job.estimatedFee}</span>
              </div>

              <div className="flex items-center justify-between pt-1 gap-2">
                <div className="flex gap-1.5">
                  <Button size="xs" variant="outline" className="gap-1 text-[11px]">
                    <Phone className="size-3" /> Hubungi
                  </Button>
                  <Button size="xs" variant="outline" className="gap-1 text-[11px]">
                    <Navigation className="size-3" /> Peta
                  </Button>
                </div>

                {job.status === "pending" && (
                  <Button
                    size="xs"
                    onClick={() => onUpdateStatus && onUpdateStatus(job.id, "in_progress")}
                  >
                    Terima Servis
                  </Button>
                )}
                {job.status === "in_progress" && (
                  <Button
                    size="xs"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white"
                    onClick={() => onUpdateStatus && onUpdateStatus(job.id, "completed")}
                  >
                    Selesai
                  </Button>
                )}
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
}