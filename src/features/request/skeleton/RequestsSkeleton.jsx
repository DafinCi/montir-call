import React from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

export default function RequestsSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {[1, 2, 3, 4].map((i) => (
        <Card key={i} className="border border-border bg-card shadow-xs">
          <CardContent className="p-5 space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-32 rounded-md" />
              <Skeleton className="h-5 w-24 rounded-full" />
            </div>
            <Skeleton className="h-14 w-full rounded-lg" />
            <div className="flex justify-between items-center pt-2">
              <Skeleton className="h-4 w-40 rounded-md" />
              <Skeleton className="h-4 w-20 rounded-md" />
            </div>
            <div className="flex justify-between items-center pt-3 border-t">
              <Skeleton className="h-8 w-24 rounded-md" />
              <Skeleton className="h-8 w-28 rounded-md" />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}