"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { getMenus } from "../menu";

export default function BottomNav({ pendingCount = 0 }) {
  const pathname = usePathname();

  if (pathname === "/qna" || pathname.includes("qna")) {
    return null;
  }

  const menus = getMenus(pendingCount);

  const centerMenu = menus.find((m) => m.href === "/dashboard" || m.isCenter);

  const otherMenus = menus.filter((m) => m !== centerMenu);
  const half = Math.ceil(otherMenus.length / 2);
  const leftMenus = otherMenus.slice(0, half);
  const rightMenus = otherMenus.slice(half);

  const renderRegularMenu = (menu) => {
    const Icon = menu.icon;
    const isActive = pathname === menu.href;

    return (
      <Link
        key={menu.href}
        href={menu.href}
        className={`relative flex flex-1 flex-col items-center justify-center py-1 transition-all duration-200 ${
          isActive
            ? "text-primary font-bold"
            : "text-primary hover:text-foreground font-medium"
        }`}
      >
        <div className="relative">
          {Icon && (
            <Icon
              className={`size-5 transition-transform duration-200 ${
                isActive ? "scale-110 text-muted-foreground" : ""
              }`}
            />
          )}

          {menu.badge > 0 && (
            <span className="absolute -top-1.5 -right-2.5 bg-destructive text-primary text-[10px] font-bold px-1.5 py-0.5 rounded-full border border-background">
              {menu.badge > 99 ? "99+" : menu.badge}
            </span>
          )}
        </div>

        <span className="text-[10px] mt-1 tracking-tight leading-none text-center">
          {menu.title || menu.label}
        </span>
      </Link>
    );
  };

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-primary-foreground backdrop-blur-md border-t border-border shadow-lg px-2 py-1.5 flex items-center justify-between">
      <div className="flex flex-1 justify-around items-center">
        {leftMenus.map(renderRegularMenu)}
      </div>

      {centerMenu &&
        (() => {
          const Icon = centerMenu.icon;
          const isActive = pathname === centerMenu.href;

          return (
            <Link
              key={centerMenu.href}
              href={centerMenu.href}
              className="relative flex flex-col items-center justify-center -mt-6 mx-2 z-10 shrink-0"
            >
              <div
                className={`size-14 rounded-full flex flex-col items-center justify-center transition-all duration-200 ${
                  isActive
                    ? "bg-secondary/90 text-primary ring-4 ring-primary/25 scale-130"
                    : "bg-secondary/80 text-primary hover:bg-primary/90 scale-125"
                }`}
              >
                {Icon && <Icon className="size-5 mb-0.5" />}
                <span className="text-[9px] font-bold tracking-tight leading-none text-center px-1">
                  {centerMenu.title || centerMenu.label || "Dashboard"}
                </span>

                {centerMenu.badge > 0 && (
                  <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-[10px] font-bold px-1.5 py-0.5 rounded-full border-2 border-background">
                    {centerMenu.badge > 99 ? "99+" : centerMenu.badge}
                  </span>
                )}
              </div>
            </Link>
          );
        })()}

      <div className="flex flex-1 justify-around items-center">
        {rightMenus.map(renderRegularMenu)}
      </div>
    </nav>
  );
}
