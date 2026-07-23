"use client";

import Link from "next/link";
import { useMemo } from "react";
import { usePathname } from "next/navigation";
import {
  Bell,
  LogOut,
  Settings,
  User,
} from "lucide-react";

import MobileSidebar from "../sidebar/MobileSidebar";

import { Button } from "@/components/ui/button";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

  const title = useMemo(() => {
    return pageTitles[pathname] ?? "MontirGo";
  }, [pathname]);

  return (
    <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-border bg-background px-4 md:px-6">

      {/* Left */}
      <div className="flex items-center gap-3">

        <MobileSidebar />

        <div>
          <h1 className="text-xl font-bold text-foreground">
            {title}
          </h1>

          <p className="hidden text-sm text-muted-foreground md:block">
            Selamat datang kembali 
          </p>
        </div>

      </div>

      {/* Right */}
      <div className="flex items-center gap-2">

        {/* Notification */}
        <Button
          variant="ghost"
          size="icon"
          className="relative"
        >
          <Bell className="size-5" />

          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary" />
        </Button>

        {/* User */}
        <DropdownMenu>

          <DropdownMenuTrigger asChild>

            <Button
              variant="ghost"
              className="h-auto px-2"
            >

              <Avatar className="size-9">

                <AvatarImage src={user.avatar} />

                <AvatarFallback>
                  {user.name.charAt(0)}
                </AvatarFallback>

              </Avatar>

            </Button>

          </DropdownMenuTrigger>

          <DropdownMenuContent
            align="end"
            className="w-56"
          >

            <div className="px-3 py-2">

              <p className="font-medium">
                {user.name}
              </p>

              <p className="text-sm text-muted-foreground">
                {user.email}
              </p>

            </div>

            <DropdownMenuSeparator />

            <DropdownMenuItem asChild>

              <Link
                href="/profile"
                className="cursor-pointer"
              >
                <User className="mr-2 size-4" />

                Profile
              </Link>

            </DropdownMenuItem>

            <DropdownMenuItem>

              <Settings className="mr-2 size-4" />

              Settings

            </DropdownMenuItem>

            <DropdownMenuSeparator />

            <DropdownMenuItem className="text-red-600">

              <LogOut className="mr-2 size-4" />

              Logout

            </DropdownMenuItem>

          </DropdownMenuContent>

        </DropdownMenu>

      </div>

    </header>
  );
}