import {
  LayoutDashboard,
  CarFront,
  MapPinned,
  Bell,
  User,
} from "lucide-react";

export const menus = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Job Request",
    href: "/request",
    icon: CarFront,
    badge: 2,
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
    badge: 5,
  },
  {
    title: "Profile",
    href: "/profile",
    icon: User,
  },
];