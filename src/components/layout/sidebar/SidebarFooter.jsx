"use client";

import {
  ChevronsUpDown,
  LogOut,
  Settings,
  User,
  ShieldCheck,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import { Button } from "@/components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export default function SidebarFooter({
  collapsed = false,
  user = {
    name: "John Doe",
    email: "john@example.com",
    avatar: "",
    online: true,
  },
}) {
  return (
    <div className="p-2">
      <DropdownMenu>
        {/* Tombol Pemicu di Sidebar Footer */}
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className={`
              w-full
              h-12
              p-2
              rounded-xl
              /* Mencegah background berubah jadi putih saat di-hover atau saat menu terbuka */
              hover:bg-white/10
              data-[state=open]:bg-white/10
              transition-colors
              flex
              items-center
              ${collapsed ? "justify-center" : "justify-between"}
            `}
          >
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="relative shrink-0">
                <Avatar className="size-8 border border-white/20">
                  <AvatarImage src={user.avatar} />
                  <AvatarFallback className="bg-secondary text-secondary-foreground font-semibold text-xs">
                    {user.name.charAt(0)}
                  </AvatarFallback>
                </Avatar>

                <span
                  className={`
                    absolute
                    -bottom-0.5
                    -right-0.5
                    size-2.5
                    rounded-full
                    ring-2
                    ring-primary-foreground
                    ${user.online ? "bg-secondary" : "bg-primary/40"}
                  `}
                />
              </div>

              {/* Teks Nama & Email di Footer Button - Selalu Terbaca Jelas */}
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

        {/* Pop-up Menu Dropdown */}
        <DropdownMenuContent
          side="top"
          align="start"
          className="w-56 rounded-xl p-1.5 shadow-lg bg-popover text-popover-foreground border-border"
        >
          {/* Header Ringkas di Dropdown */}
          <DropdownMenuLabel className="font-normal p-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="size-3.5 text-secondary shrink-0" />
              <p className="text-[11px] font-medium text-muted-foreground leading-none">
                Montir Terverifikasi
              </p>
            </div>
          </DropdownMenuLabel>

          <DropdownMenuSeparator />

          <DropdownMenuGroup>
            <DropdownMenuItem className="rounded-lg cursor-pointer text-xs focus:bg-accent focus:text-accent-foreground">
              <User className="mr-2 size-3.5 text-muted-foreground" />
              Profil Saya
            </DropdownMenuItem>

            <DropdownMenuItem className="rounded-lg cursor-pointer text-xs focus:bg-accent focus:text-accent-foreground">
              <Settings className="mr-2 size-3.5 text-muted-foreground" />
              Pengaturan Akun
            </DropdownMenuItem>
          </DropdownMenuGroup>

          <DropdownMenuSeparator />

          <DropdownMenuItem className="rounded-lg cursor-pointer text-xs text-destructive focus:bg-destructive/10 focus:text-destructive">
            <LogOut className="mr-2 size-3.5" />
            Keluar Akun
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}