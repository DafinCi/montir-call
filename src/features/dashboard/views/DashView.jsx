"use client";

import React, { useState } from "react";
import DashHeader from "../components/DashHeader";
import DashStats from "../components/DashStats";
import ActiveJobs from "../components/ActiveJobs";
import QuickAction from "../components/QuickAction";
import RecentActivities from "../components/RecentActivities";
import { FinancialChart } from "../components/FinancialChart";
import { FinancialSummary } from "../components/FinancialSummary";

export default function DashboardView() {
  const [isOnline, setIsOnline] = useState(true);

  const [activeJobs, setActiveJobs] = useState([
    {
      id: "JOB-1024",
      customer: "Budi Santoso",
      vehicle: "Honda Vario 150",
      issue: "Mogok & Aki Soak",
      location: "Jl. Pemuda No. 45, Semarang",
      status: "pending",
      estimatedFee: "Rp 150.000",
    },
    {
      id: "JOB-1023",
      customer: "Siti Rahma",
      vehicle: "Toyota Avanza Veloz",
      issue: "Ban bocor & ganti oli",
      location: "Jl. Gajah Mada No. 12, Semarang",
      status: "in_progress",
      estimatedFee: "Rp 275.000",
    },
  ]);

  // Sample data untuk grafik & ringkasan keuangan
  const [financialData] = useState([
    { day: "Sen", amount: 250000 },
    { day: "Sel", amount: 400000 },
    { day: "Rab", amount: 320000 },
    { day: "Kam", amount: 510000 },
    { day: "Jum", amount: 425000 },
    { day: "Sab", amount: 680000 },
    { day: "Min", amount: 550000 },
  ]);

  const [financialSummary] = useState({
    daily: 425000,
    weekly: 3135000,
    monthly: 12500000,
  });

  const handleUpdateStatus = (id, newStatus) => {
    setActiveJobs((prev) =>
      prev.map((job) => (job.id === id ? { ...job, status: newStatus } : job))
    );
  };

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <DashHeader
        isOnline={isOnline}
        onToggleOnline={() => setIsOnline(!isOnline)}
      />

      {/* STATS CARDS */}
      <DashStats activeCount={activeJobs.filter((j) => j.status !== "completed").length} />

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE JOBS & FINANCIAL SECTION (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ActiveJobs jobs={activeJobs} onUpdateStatus={handleUpdateStatus} />
          
          {/* FINANCIAL SECTION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <FinancialChart data={financialData} />
            </div>
            <div className="md:col-span-5">
              <FinancialSummary summary={financialSummary} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & RECENT ACTIVITIES (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <QuickAction />
          <RecentActivities />
        </div>
      </div>
    </div>
  );
}