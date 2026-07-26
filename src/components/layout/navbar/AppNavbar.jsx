"use client";

import { useMemo, useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import MobileSidebar from "../sidebar/BottomNav";

const pageTitles = {
  "/dashboard": "Dashboard",
  "/request": "Job Request",
  "/tracking": "Tracking",
  "/notification": "Notifications",
  "/profile": "Profile",
};

export default function AppNavbar({ user, pendingCount = 0 }) {
  const pathname = usePathname();
  const [currentDate, setCurrentDate] = useState("");

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
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-primary-foreground px-4 md:px-6">
      {/* Left */}
      <div className="flex items-center gap-3">
        <MobileSidebar user={user} pendingCount={pendingCount} />

        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-primary font-ubuntu">
            {title}
          </h1>

          <p className="text-xs text-secondary capitalize mt-0.5">
            {currentDate || "-"}
          </p>
        </div>
      </div>
    </header>
  );
}
