"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { Badge } from "@/components/ui";
import { cn } from "@/lib/utils";

export default function SidebarItem({
  title,
  href,
  icon: Icon,
  badge,
  collapsed = false,
}) {
  const pathname = usePathname();

  const active = pathname === href;

  return (
    <Link
      href={href}
      className={cn(
        "group flex h-11 items-center rounded-sm px-3 transition-all duration-200",

        active
          ? "bg-primary text-primary-foreground shadow-md"
          : "text-muted-foreground hover:bg-secondary hover:text-foreground"
      )}
    >
      {/* Icon */}
      <Icon
        size={20}
        className={cn(
          "shrink-0 transition-colors",
          active
            ? "text-primary-foreground"
            : "text-muted-foreground group-hover:text-foreground"
        )}
      />

      {/* Text */}
      {!collapsed && (
        <>
          <span className="ml-3 flex-1 text-sm font-medium">
            {title}
          </span>

          {badge && badge > 0 && (
            <Badge
              variant="secondary"
              className={cn(
                "rounded-full px-2",

                active &&
                  "bg-primary-foreground text-primary"
              )}
            >
              {badge}
            </Badge>
          )}
        </>
      )}
    </Link>
  );
}