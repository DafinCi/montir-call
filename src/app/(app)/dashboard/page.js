// src/app/(app)/dashboard/page.js
import DashboardView from "@/features/dashboard/views/DashView";

export const metadata = {
  title: "Dashboard - Service Montir",
};

export default function DashboardPage() {
  return <DashboardView />;
}