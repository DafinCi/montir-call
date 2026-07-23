"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Wrench } from "lucide-react";

import { Button } from "@/components/ui/button";

import SidebarItem from "./SidebarItem";
import SidebarFooter from "./SidebarFooter";

import { menus } from "../menu";

export default function AppSidebar() {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`
        hidden
        md:flex
        h-screen
        flex-col
        border-r
        border-border
        bg-background
        transition-all
        duration-300
        ${collapsed ? "w-20" : "w-72"}
      `}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between border-b border-border px-4">

        <Link
          href="/dashboard"
          className="flex items-center gap-3"
        >
          <div className="flex size-11 items-center justify-center rounded-sm bg-primary">
            <Wrench className="text-primary-foreground" size={22} />
          </div>

          {!collapsed && (
            <div>
              <h2 className="font-bold text-foreground">
                MontirGo
              </h2>

              <p className="text-xs text-muted-foreground">
                Mechanic Dashboard
              </p>
            </div>
          )}
        </Link>

        <Button
          size="icon"
          variant="ghost"
          onClick={() => setCollapsed(!collapsed)}
        >
          {collapsed ? (
            <ChevronRight size={18} />
          ) : (
            <ChevronLeft size={18} />
          )}
        </Button>

      </div>

      {/* Menu */}
      <nav className="flex-1 space-y-2 overflow-y-auto p-3">

        {menus.map((menu) => (
          <SidebarItem
            key={menu.href}
            {...menu}
            collapsed={collapsed}
          />
        ))}

      </nav>

      {/* Footer */}
      <SidebarFooter
        collapsed={collapsed}
        user={{
          name: "Dafin",
          email: "dafin@gmail.com",
          avatar: "",
          online: true,
        }}
      />
    </aside>
  );
}