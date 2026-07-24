"use client";

import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

export function DashboardSkeleton() {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* 1. HEADER SKELETON */}
      <div className="p-4 rounded-2xl border bg-card flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="space-y-2">
          <Skeleton className="h-6 w-48" />
          <Skeleton className="h-3.5 w-32" />
        </div>
        <Skeleton className="h-10 w-36 rounded-lg" />
      </div>

      {/* 2. STATS CARDS SKELETON (4 Cards Grid) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="shadow-xs">
            <CardContent className="p-5 space-y-3">
              <div className="flex items-center justify-between">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-8 w-8 rounded-full" />
              </div>
              <Skeleton className="h-8 w-16" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* 3. MAIN CONTENT GRID SKELETON */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE JOBS SKELETON (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <Card className="shadow-xs">
            <CardHeader className="pb-4 border-b">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <Skeleton className="h-6 w-40" />
                  <Skeleton className="h-3 w-56" />
                </div>
                <Skeleton className="h-6 w-16 rounded-full" />
              </div>
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {Array.from({ length: 2 }).map((_, i) => (
                <div key={i} className="p-4 rounded-sm border space-y-3">
                  <div className="flex justify-between items-center">
                    <Skeleton className="h-4 w-32" />
                    <Skeleton className="h-5 w-20 rounded-full" />
                  </div>
                  <div className="space-y-2">
                    <Skeleton className="h-5 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-16 w-full rounded-lg" />
                  <div className="flex justify-between pt-2">
                    <Skeleton className="h-8 w-24 rounded-md" />
                    <Skeleton className="h-8 w-28 rounded-md" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & RECENT ACTIVITIES SKELETON (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          {/* Quick Actions Skeleton */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b">
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent className="p-4 space-y-3">
              <Skeleton className="h-10 w-full rounded-lg" />
              <Skeleton className="h-10 w-full rounded-lg" />
            </CardContent>
          </Card>

          {/* Recent Activities Skeleton */}
          <Card className="shadow-xs">
            <CardHeader className="pb-3 border-b">
              <Skeleton className="h-5 w-36" />
            </CardHeader>
            <CardContent className="p-4 space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-1.5">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-3 w-20" />
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

export default DashboardSkeleton;
