import {
  LayoutDashboard,
  CarFront,
  User,
  BotMessageSquare,
  Activity,
} from "lucide-react";

export const getMenus = (pendingCount = 0) => [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Job Request",
    href: "/request",
    icon: CarFront,
    badge: pendingCount,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
  {
    title: "Tanya AI",
    href: "/qna",
    icon: BotMessageSquare,
  },
  {
    title: "aktivitas",
    href: "/aktivitas",
    icon: Activity,
  }
];
