"use client";

import React from "react";
import { Search, SlidersHorizontal, AlertTriangle, RefreshCw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function JobFilterBar({ 
  searchQuery, 
  onSearchChange, 
  activeTab, 
  onTabChange,
  onRefresh,
  isRefreshing 
}) {
  const tabs = [
    { id: "all", label: "Semua Permintaan" },
    { id: "emergency", label: "Darurat 🚨" },
    { id: "scheduled", label: "Terjadwal" },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        
        {/* Search Field */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <Input
            placeholder="Cari plat nomor, nama pelanggan, atau lokasi..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 text-xs h-9 bg-card"
          />
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <Button
            variant="outline"
            size="icon"
            title="Refresh Data"
            disabled={isRefreshing}
            onClick={onRefresh}
            className="group text-muted-foreground hover:text-foreground transition-colors size-9"
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

      {/* Filter Tabs */}
      <div className="flex items-center gap-1.5 border-b border-border/60 pb-2 overflow-x-auto">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => onTabChange(tab.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all ${
                isActive
                  ? "bg-secondary/15 text-secondary-foreground font-semibold border border-secondary/30"
                  : "text-muted-foreground hover:text-card-foreground hover:bg-muted/30"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}