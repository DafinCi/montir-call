// src/app/(app)/dashboard/page.js
import DashboardView from "@/features/dashboard/views/DashboardView";

export const metadata = {
  title: "Dashboard - Service Montir",
};

export default function DashboardPage() {
  return <DashboardView />;
}