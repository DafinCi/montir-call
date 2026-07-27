import { LayoutDashboard, CarFront, MapPinned, Bell, User, CreditCard } from "lucide-react";

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
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];
