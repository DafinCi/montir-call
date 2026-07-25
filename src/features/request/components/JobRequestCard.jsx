"use client";

import React from "react";
import { 
  MapPin, 
  Clock, 
  Car, 
  AlertTriangle, 
  ChevronRight, 
  CheckCircle2, 
  Navigation,
  Phone
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

export default function JobRequestCard({ job, onSelect, onAccept }) {
  const isEmergency = job.priority === "emergency";

  return (
    <Card className="group relative overflow-hidden border border-border bg-card hover:border-secondary/40 transition-all shadow-xs">
      {/* Accent Indicator Bar */}
      <div 
        className={`absolute top-0 left-0 bottom-0 w-1 ${
          isEmergency ? "bg-destructive" : "bg-secondary"
        }`} 
      />

      <CardContent className="p-4 sm:p-5 pl-5 sm:pl-6">
        <div className="flex flex-col gap-3">
          
          {/* Header Row: Customer & Priority Badge */}
          <div className="flex items-start justify-between gap-2">
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium text-muted-foreground">
                  #{job.id}
                </span>
                <span className="text-xs text-muted-foreground">•</span>
                <span className="text-xs font-medium text-muted-foreground flex items-center gap-1">
                  <Clock className="size-3" /> {job.createdAt}
                </span>
              </div>
              <h3 className="text-base font-semibold text-card-foreground mt-0.5">
                {job.customerName}
              </h3>
            </div>

            {isEmergency ? (
              <Badge variant="destructive" className="gap-1 text-[11px] font-semibold animate-pulse">
                <AlertTriangle className="size-3" /> Mogok Darurat
              </Badge>
            ) : (
              <Badge variant="secondary" className="text-[11px] font-medium bg-secondary/15 text-secondary-foreground border-secondary/20">
                Terjadwal
              </Badge>
            )}
          </div>

          {/* Vehicle & Problem Info */}
          <div className="p-3 rounded-lg bg-muted/20 border border-border/50 text-xs space-y-1.5">
            <div className="flex items-center gap-2 font-medium text-card-foreground">
              <Car className="size-3.5 text-secondary shrink-0" />
              <span>{job.vehicleModel} ({job.licensePlate})</span>
            </div>
            <p className="text-muted-foreground line-clamp-2 pl-5">
              &rdquo;{job.problemDescription}&rdquo;
            </p>
          </div>

          {/* Location & Distance */}
          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
            <div className="flex items-center gap-1.5 truncate max-w-[70%]">
              <MapPin className="size-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{job.locationAddress}</span>
            </div>
            <div className="font-semibold text-card-foreground shrink-0 bg-background px-2 py-0.5 rounded border border-border text-[11px]">
              {job.distanceKm} km ({job.estimatedTime})
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between gap-2 pt-2 border-t border-border/60 mt-1">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => onSelect(job)}
              className="text-xs text-muted-foreground hover:text-card-foreground h-8 px-2 gap-1"
            >
              Detail Lengkap <ChevronRight className="size-3.5" />
            </Button>

            <div className="flex items-center gap-2">
              <Button
                type="button"
                size="sm"
                onClick={() => onAccept(job.id)}
                className="text-xs h-8 px-3 font-semibold gap-1.5 shadow-xs"
              >
                <CheckCircle2 className="size-3.5" /> Terima Job
              </Button>
            </div>
          </div>

        </div>
      </CardContent>
    </Card>
  );
}