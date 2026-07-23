"use client";

import Link from "next/link";
import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import MobileSidebar from "../sidebar/MobileSidebar";


const pageTitles = {
  "/dashboard": "Dashboard",
  "/request": "Job Request",
  "/tracking": "Tracking",
  "/notification": "Notifications",
  "/profile": "Profile",
};

export default function AppNavbar({
  user = {
    name: "Dafin",
    email: "dafin@email.com",
    avatar: "",
  },
}) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");

  // Format tanggal asli sesuai waktu lokal saat ini (Bahasa Indonesia)
  useEffect(() => {
    const formatted = new Intl.DateTimeFormat("id-ID", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date());

    setCurrentDate(formatted);
  }, []);

  const title = useMemo(() => {
    return pageTitles[pathname] ?? "MontirGo";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 flex h-25 items-center justify-between border-b border-border bg-primary-foreground px-4 md:px-6">

      {/* Left */}
      <div className="flex items-center gap-3">
        <MobileSidebar />

        <div>
          <h1 className="text-3xl font-bold text-primary">
            {title}
          </h1>

          {/* TANGGAL ASLI DINAMIS */}
          <p className="hidden text-sm text-secondary md:block capitalize">
            {currentDate || "-"}
          </p>
        </div>
      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

      </div>
    </header>
  );
}