import { LayoutDashboard, CarFront, MapPinned, Bell, User } from "lucide-react";

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
    badge: pendingCount, // Angka dinamis dari database
  },
  {
    title: "Tracking",
    href: "/tracking",
    icon: MapPinned,
  },
  {
    title: "Notification",
    href: "/notification",
    icon: Bell,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];
