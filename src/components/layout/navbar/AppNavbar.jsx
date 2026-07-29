"use client";

import { useMemo, useState, useEffect, useTransition } from "react";
import { usePathname } from "next/navigation";
import { LogOut, Loader2, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import { logoutMechanic } from "@/features/auth/services/auth.action";
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
  const [isPending, startTransition] = useTransition();

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

  const handleLogout = () => {
    startTransition(async () => {
      await logoutMechanic();
    });
  };

  const isOnline = user?.status === "AVAILABLE" || user?.status === "BUSY";

  return (
    <header className="sticky top-0 z-40 flex h-20 items-center justify-between border-b border-border bg-primary-foreground px-4 md:px-6">
      {/* KIRI: Navigation Title & Date */}
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

      {/* KANAN: Dropdown Profile & Logout khusus layar HP (md:hidden) */}
      <div className="flex items-center md:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              disabled={isPending}
              className="relative size-10 rounded-full p-0 focus-visible:ring-1 focus-visible:ring-ring"
            >
              <Avatar className="size-9 border border-border">
                <AvatarImage src={user?.avatar} />
                <AvatarFallback className="bg-secondary text-primary font-semibold text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : "M"}
                </AvatarFallback>
              </Avatar>

              {/* Status Indicator */}
              <span
                className={`absolute bottom-0 right-0 size-2.5 rounded-full ring-2 ring-background ${
                  isOnline ? "bg-secondary" : "bg-primary"
                }`}
              />
            </Button>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56 rounded-xl p-1.5 shadow-lg border-border bg-popover text-popover-foreground"
          >
            {/* Info Montir */}
            <DropdownMenuLabel className="font-normal p-2">
              <div className="flex flex-col space-y-1">
                <p className="text-xs font-semibold leading-none text-muted-foreground truncate">
                  {user?.name || "Montir"}
                </p>
                <p className="text-[10px] leading-none text-muted-foreground truncate">
                  {user?.email || "montir@app.com"}
                </p>
              </div>
            </DropdownMenuLabel>

            <DropdownMenuSeparator />

            {/* Tombol Logout */}
            <DropdownMenuItem
              onClick={handleLogout}
              disabled={isPending}
              className="rounded-lg cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive font-medium"
            >
              {isPending ? (
                <Loader2 className="mr-2 size-3.5 animate-spin" />
              ) : (
                <LogOut className="mr-2 size-3.5" />
              )}
              Keluar Akun
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}