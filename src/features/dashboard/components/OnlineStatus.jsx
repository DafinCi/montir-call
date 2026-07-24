"use client";

import React from "react";

export const OnlineStatus = ({ status, onToggle, isToggling }) => {
  const isOnline = status === "AVAILABLE";
  const isBusy = status === "BUSY";

  return (
    <div className="bg-card p-4 rounded-2xl border shadow-xs flex items-center justify-between">
      <div className="flex items-center gap-3">
        <span
          className={`w-3 h-3 rounded-full ${
            isBusy
              ? "bg-amber-500 animate-pulse"
              : isOnline
                ? "bg-emerald-500 animate-ping"
                : "bg-slate-400"
          }`}
        ></span>
        <div>
          <p className="text-[10px] text-muted-foreground font-semibold tracking-wider">
            STATUS MONTIR
          </p>
          <p className="text-sm font-semibold text-foreground">
            {isBusy
              ? "Sedang Melayani Order"
              : isOnline
                ? "Siap Terima Order"
                : "Off / Istirahat"}
          </p>
        </div>
      </div>

      <button
        onClick={onToggle}
        disabled={isToggling || isBusy}
        className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all duration-300 disabled:opacity-50 ${
          isOnline
            ? "bg-destructive/10 text-destructive hover:bg-destructive/20"
            : "bg-primary text-primary-foreground hover:bg-primary/90"
        }`}
      >
        {isToggling
          ? "Memproses..."
          : isBusy
            ? "Sedang Sibuk"
            : isOnline
              ? "Matikan Status"
              : "Aktifkan Montir"}
      </button>
    </div>
  );
};

export default OnlineStatus;
