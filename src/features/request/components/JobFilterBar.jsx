"use client";

import React from "react";
import { RefreshCw } from "lucide-react";
import { Button } from "@/components/ui";

export default function JobFilterBar({
  activeTab,
  onTabChange,
  onRefresh,
  isRefreshing,
  counts = { all: 0, emergency: 0, scheduled: 0 },
}) {
  const tabs = [
    { id: "all", label: "Semua Permintaan", count: counts.all },
    { id: "emergency", label: "Darurat", count: counts.emergency },
    { id: "scheduled", label: "Terjadwal", count: counts.scheduled },
  ];

  return (
    <div>
      {/* Filter Tabs dengan Badge Count */}
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 overflow-x-auto no-scrollbar">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`flex items-center gap-1 sm:gap-1.5 px-2 py-1 sm:px-3 sm:py-1.5 rounded-md sm:rounded-lg text-[10px] sm:text-xs font-medium whitespace-nowrap transition-all cursor-pointer ${
                  isActive
                    ? "bg-secondary/15 text-primary-foreground font-semibold border border-secondary/30 shadow-2xs"
                    : "text-muted-foreground hover:text-card-foreground hover:bg-muted/40"
                }`}
              >
                <span>{tab.label}</span>
                <span
                  className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                    isActive
                      ? "bg-secondary text-primary"
                      : "bg-muted text-primary"
                  }`}
                >
                  {tab.count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            title="Refresh Permintaan Masuk"
            disabled={isRefreshing}
            onClick={onRefresh}
            className="group text-muted-foreground hover:text-muted transition-colors size-9 shrink-0 bg-card"
          >
            <RefreshCw
              className={`size-3.5 transition-transform duration-500 ease-in-out ${
                isRefreshing
                  ? "animate-spin text-primary"
                  : "group-hover:rotate-180"
              }`}
            />
          </Button>
        </div>
      </div>
    </div>
  );
}
