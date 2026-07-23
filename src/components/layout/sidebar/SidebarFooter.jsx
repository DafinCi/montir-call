"use client";

import {
  ChevronUp,
  LogOut,
  Settings,
  User,
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
  DropdownMenuItem,
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
    <div className="border-t border-border p-3">

      <DropdownMenu>

        <DropdownMenuTrigger asChild>

          <Button
            variant="ghost"
            className={`
              w-full
              h-auto
              justify-start
              p-2
              ${collapsed ? "justify-center" : ""}
            `}
          >

            <Avatar className="size-10">

              <AvatarImage src={user.avatar} />

              <AvatarFallback>
                {user.name.charAt(0)}
              </AvatarFallback>

            </Avatar>

            {!collapsed && (
              <>
                <div className="ml-3 flex-1 text-left">

                  <p className="text-sm font-semibold">
                    {user.name}
                  </p>

                  <div className="flex items-center gap-2">

                    <span
                      className={`
                        size-2
                        rounded-full
                        ${
                          user.online
                            ? "bg-green-500"
                            : "bg-red-500"
                        }
                      `}
                    />

                    <p className="text-xs text-muted-foreground">
                      {user.online ? "Online" : "Offline"}
                    </p>

                  </div>

                </div>

                <ChevronUp
                  size={18}
                  className="text-muted-foreground"
                />
              </>
            )}

          </Button>

        </DropdownMenuTrigger>

        <DropdownMenuContent
          side="top"
          align="start"
          className="w-56"
        >

          <DropdownMenuItem>

            <User className="mr-2 size-4" />

            Profile

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
  );
}