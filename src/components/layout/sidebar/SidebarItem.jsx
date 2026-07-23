"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SidebarItem({
  title,
  href,
  icon: Icon,
  badge,
  collapsed = false,
}) {
  const pathname = usePathname();
  const active = pathname === href;

  const content = (
    <Link
      href={href}
      className={cn(
        "group relative flex h-10 items-center rounded-sm px-3 text-sm font-medium transition-all duration-200 outline-none",
        active
          ? "bg-secondary text-secondary-foreground shadow-xs font-semibold"
          : "text-primary hover:bg-accent/80 hover:text-primary-foreground",
        collapsed && "justify-center px-0"
      )}
    >
      {/* Active Indicator Bar */}
      {active && !collapsed && (
        <span className="absolute left-0 top-1/2 h-5 w-1 -translate-y-1/2 rounded-r-full bg-primary" />
      )}

      {/* Icon */}
      <Icon
        className={cn(
          "size-4.5 shrink-0 transition-transform duration-200 group-hover:scale-105",
          active
            ? "text-secondary-foreground"
            : "text-primary group-hover:text-primary-foreground"
        )}
      />

      {/* Text & Badge */}
      {!collapsed && (
        <div className="ml-3 flex flex-1 items-center justify-between overflow-hidden">
          <span className="truncate tracking-tight">{title}</span>

          {badge && badge > 0 && (
            <Badge
              variant="secondary"
              className={cn(
                "ml-2 h-5 min-w-5 justify-center rounded-full px-1.5 text-[10px] font-bold border border-border/50 ",
                active
                  ? "bg-primary text-primary-foreground"
                  : "bg-muted text-primary-foreground"
              )}
            >
              {badge}
            </Badge>
          )}
        </div>
      )}
    </Link>
  );

  // Jika collapsed, bungkus dengan Tooltip
  if (collapsed) {
    return (
      <TooltipProvider delayDuration={100}>
        <Tooltip>
          <TooltipTrigger asChild>{content}</TooltipTrigger>
          <TooltipContent side="right" className="flex items-center gap-2 font-medium">
            {title}
            {badge && badge > 0 && (
              <Badge variant="secondary" className="px-1.5 py-0 text-[10px]">
                {badge}
              </Badge>
            )}
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    );
  }

  return content;
}