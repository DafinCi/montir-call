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
          className="md:hidden size-9 rounded-sm hover:bg-accent"
        >
          <Menu className="size-5 text-foreground" />
        </Button>
      </SheetTrigger>

<SheetContent
  side="left"
  className="flex w-72 flex-col p-0 bg-primary-foreground text-primary transition-all duration-300 ease-in-out data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=open]:slide-in-from-left data-[state=closed]:slide-out-to-left"
>
        {/* Header */}
        <SheetHeader className="p-4 bg-primary-foreground">
          <SheetTitle asChild>
            <Link
              href="/dashboard"
              className="flex items-center gap-3"
            >
              <div className="flex size-9 items-center justify-center rounded-sm shadow-xs bg-primary text-primary-foreground">
                <Wrench size={18} />
              </div>

              <div className="flex flex-col leading-none text-left">
                <h2 className="text-bold font-bold  tracking-tight text-primary text-xl">
                  Montir<span className="text-secondary">Go</span>
                </h2>

                <p className="text-[11px] font-medium mt-0.5">
                  Mechanic Suite
                </p>
              </div>
            </Link>
          </SheetTitle>
        </SheetHeader>

        {/* Menu */}
        <div className="flex-1 overflow-y-auto p-3 space-y-4 ">
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider ">
            Navigasi Utama
          </p>

          <nav className="space-y-1.5">
            {menus.map((menu) => (
              <SidebarItem
                key={menu.href}
                {...menu}
              />
            ))}
          </nav>
        </div>

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