"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Wrench } from "lucide-react";

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
        sticky
        top-0
        shrink-0
        h-screen
        flex-col
        bg-primary-foreground
        text-card-foreground
        transition-all
        duration-300
        ease-in-out
        z-30
        ${collapsed ? "w-17" : "w-64"}
      `}
    >
      {/* Header */}
      <div className="flex h-20 items-center justify-between px-4">
        <Link
          href="/dashboard"
          className="flex items-center gap-3 overflow-hidden group"
        >
          <div className="flex size-9 shrink-0 items-center justify-center rounded-sm bg-primary text-primary-foreground shadow-xs transition-transform duration-200 group-hover:scale-105">
            <Wrench className="size-5" />
          </div>

          {!collapsed && (
            <div className="flex flex-col leading-none">
              <span className="font-bold tracking-tight text-primary text-2xl">
                Montir<span className="text-secondary">Go</span>
              </span>
              <span className="text-[11px] text-primary mt-0.5 font-medium">
                Mechanic Suite
              </span>
            </div>
          )}
        </Link>

        <Button
          size="icon"
          variant="ghost"
          className="group size-8 text-primary transition-all shrink-0 w-10 hover:text-primary-foreground bg-primary-foreground"
          onClick={() => setCollapsed(!collapsed)}
          title={collapsed ? "Expand Sidebar" : "Collapse Sidebar"}
        >
        {collapsed ? (
            <ArrowRight
              size={18}
              className="transition-transform duration-200 group-hover:translate-x-2"
            />
          ) : (
            <ArrowLeft
              size={18}
              className="transition-transform duration-200 group-hover:-translate-x-2"
            />
          )}
        </Button>
        </div>

      {/* Menu Area */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-4">
        {!collapsed && (
          <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-primary">
            Navigasi Utama
          </p>
        )}

        <nav className="space-y-1.5 text-primary">
          {menus.map((menu) => (
            <SidebarItem
              key={menu.href}
              {...menu}
              collapsed={collapsed}
            />
          ))}
        </nav>
      </div>

      {/* Footer Profile */}
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