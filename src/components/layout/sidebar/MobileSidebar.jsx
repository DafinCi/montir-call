"use client";

import Link from "next/link";
import { Menu, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";

import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";
import { menus } from "../menu";

export default function MobileSidebar() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="md:hidden"
        >
          <Menu className="size-5" />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="left"
        className="flex w-72 flex-col p-0"
      >
        {/* Header */}
        <SheetHeader className="border-b border-border p-4">
          <SheetTitle asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex size-10 items-center justify-center rounded-sm bg-primary">
                <Wrench
                  className="text-primary-foreground"
                  size={20}
                />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  MontirGo
                </h2>

                <p className="text-xs text-muted-foreground">
                  Mechanic Dashboard
                </p>
              </div>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Menu */}
        <nav className="flex-1 space-y-2 overflow-y-auto p-3">
          {menus.map((menu) => (
            <SidebarItem
              key={menu.href}
              {...menu}
            />
          ))}
        </nav>

        {/* Footer */}
        <SidebarFooter
          user={{
            name: "Dafin",
            email: "dafin@gmail.com",
            avatar: "",
            online: true,
          }}
        />
      </SheetContent>
    </Sheet>
  );
}