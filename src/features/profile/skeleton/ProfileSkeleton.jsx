import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function ProfileSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6 animate-pulse">
      {/* HEADER SKELETON */}
      <div className="relative rounded-2xl border bg-card text-card-foreground shadow-xs overflow-hidden">
        {/* Banner */}
        <Skeleton className="h-28 w-full rounded-none" />

        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-12">
            {/* Avatar & Info Utama */}
            <div className="flex flex-col sm:flex-row items-center sm:items-end gap-4 text-center sm:text-left">
              <Skeleton className="size-24 sm:size-28 rounded-full border-4 border-card shrink-0" />

              <div className="space-y-2 mb-1 flex flex-col items-center sm:items-start">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-7 w-40 rounded-md" />
                  <Skeleton className="h-5 w-32 rounded-full" />
                </div>
                <Skeleton className="h-4 w-56 rounded-md" />
              </div>
            </div>

            {/* Quick Stat Pill */}
            <Skeleton className="h-12 w-48 rounded-sm shrink-0 self-center sm:self-auto" />
          </div>
        </div>
      </div>

      {/* MAIN FORM & SPECIALTIES GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Form Data Diri (7 Cols) */}
        <Card className="lg:col-span-7 shadow-xs">
          <CardContent className="p-6 space-y-6">
            {/* Section 1: Kontak */}
            <div className="space-y-4">
              <div className="border-b pb-2 space-y-1.5">
                <Skeleton className="h-5 w-44 rounded-md" />
                <Skeleton className="h-3.5 w-64 rounded-md" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-24 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Skeleton className="h-3.5 w-28 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
              </div>
            </div>

            {/* Section 2: Bengkel & Rekening */}
            <div className="space-y-4 pt-2">
              <div className="border-b pb-2 space-y-1.5">
                <Skeleton className="h-5 w-48 rounded-md" />
                <Skeleton className="h-3.5 w-72 rounded-md" />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-36 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3.5 w-32 rounded-md" />
                  <Skeleton className="h-9 w-full rounded-md" />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <Skeleton className="h-3.5 w-40 rounded-md" />
                  <Skeleton className="h-16 w-full rounded-md" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: Keahlian & Radius (5 Cols) */}
        <Card className="lg:col-span-5 shadow-xs">
          <CardContent className="p-6 space-y-5">
            <div className="border-b pb-2 space-y-1.5">
              <Skeleton className="h-5 w-36 rounded-md" />
              <Skeleton className="h-3.5 w-56 rounded-md" />
            </div>

            {/* Skill Chips Skeleton */}
            <div className="space-y-2">
              <Skeleton className="h-3.5 w-32 rounded-md" />
              <div className="flex flex-wrap gap-2 pt-1">
                <Skeleton className="h-8 w-32 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
                <Skeleton className="h-8 w-36 rounded-lg" />
                <Skeleton className="h-8 w-24 rounded-lg" />
                <Skeleton className="h-8 w-40 rounded-lg" />
                <Skeleton className="h-8 w-28 rounded-lg" />
              </div>
            </div>

            {/* Range Slider Skeleton */}
            <div className="space-y-3 pt-2">
              <div className="flex justify-between items-center">
                <Skeleton className="h-3.5 w-36 rounded-md" />
                <Skeleton className="h-4 w-10 rounded-md" />
              </div>
              <Skeleton className="h-2 w-full rounded-full" />
              <div className="flex justify-between">
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
                <Skeleton className="h-3 w-16 rounded-md" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM ACTION BAR SKELETON */}
      <div className="flex items-center justify-between p-4 rounded-sm border bg-card text-card-foreground shadow-xs">
        <Skeleton className="h-4 w-72 rounded-md hidden sm:block" />
        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Skeleton className="h-9 w-20 rounded-md" />
          <Skeleton className="h-9 w-32 rounded-md" />
        </div>
      </div>
    </div>
  );
}