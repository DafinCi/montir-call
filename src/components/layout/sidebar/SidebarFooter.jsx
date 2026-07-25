"use client";

import { useTransition } from "react";
import { ChevronsUpDown, LogOut, ShieldCheck, Loader2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logoutMechanic } from "@/features/auth/services/auth.action";

export default function SidebarFooter({
  collapsed = false,
  user = {
    name: "Montir",
    email: "",
    avatar: "",
    status: "OFFLINE",
  },
}) {
  const [isPending, startTransition] = useTransition();

  const handleLogout = () => {
    startTransition(async () => {
      await logoutMechanic();
    });
  };

  const isOnline = user.status === "AVAILABLE" || user.status === "BUSY";

  return (
    <div className="p-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            disabled={isPending}
            className={`
              w-full h-12 p-2 rounded-sm
              hover:bg-white/10 data-[state=open]:bg-white/10
              transition-colors flex items-center
              ${collapsed ? "justify-center" : "justify-between"}
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <Avatar className="size-8 border border-white/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold text-xs">
                    {user.name ? user.name.charAt(0).toUpperCase() : "M"}
                  </AvatarFallback>
                </Avatar>

                {/* Status Indicator */}
                <span
                  className={`
                    absolute -bottom-0.5 -right-0.5 size-2.5 rounded-full ring-2 ring-primary-foreground
                    ${isOnline ? "bg-emerald-500" : "bg-zinc-400"}
                  `}
                />
              </div>

              {!collapsed && (
                <div className="flex flex-col text-left overflow-hidden">
                  <span className="text-xs font-semibold text-primary truncate">
                    {user.name}
                  </span>
                  <span className="text-[10px] text-primary/70 truncate">
                    {user.email}
                  </span>
                </div>
              )}
            </div>

            {!collapsed && (
              <ChevronsUpDown className="size-4 shrink-0 text-primary/70" />
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          className="w-56 rounded-sm p-1.5 shadow-lg bg-popover text-popover-foreground border-border"
        >
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-secondary shrink-0" />
              <p className="text-[11px] font-medium text-muted-foreground leading-none">
                Montir Terverifikasi
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={handleLogout}
            disabled={isPending}
            className="rounded-lg cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive"
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
  );
}
