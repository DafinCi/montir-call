"use client";

import React from "react";
import { Card, CardContent, Skeleton } from "@/components/ui";

export function AktivitasSkeleton() {
  return (
    <div className="space-y-4 p-4 max-w-3xl mx-auto w-full">
      <div className="flex items-center justify-between pb-2">
        <div className="space-y-2">
          <Skeleton className="h-7 w-48 bg-muted-foreground" />
          <Skeleton className="h-4 w-64 bg-muted-foreground" />
        </div>
        <Skeleton className="h-9 w-24 rounded-md bg-muted-foreground" />
      </div>

      <Card className="border-border bg-card shadow-xs">
        <CardContent className="p-4 space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex gap-3 items-start py-2">
              <Skeleton className="size-10 rounded-full bg-muted-foreground shrink-0" />
              <div className="space-y-2 w-full">
                <div className="flex justify-between items-center">
                  <Skeleton className="h-4 w-1/3 bg-muted-foreground" />
                  <Skeleton className="h-3 w-16 bg-muted-foreground" />
                </div>
                <Skeleton className="h-3 w-3/4 bg-muted-foreground" />
              </div>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}