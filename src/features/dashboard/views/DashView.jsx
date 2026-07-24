"use client";

import React from "react";
import { useDashboard } from "../hooks/UseDashboard";
import DashHeader from "../components/DashHeader";
import DashStats from "../components/DashStats";
import ActiveJobs from "../components/ActiveJobs";
import QuickAction from "../components/QuickAction";
import RecentActivities from "../components/RecentActivities";
import FinancialChart from "../components/FinancialChart";
import FinancialSummary from "../components/FinancialSummary";
import DashboardSkeleton from "../skeletons/DashboardSkeleton";

export default function DashboardView() {
  const {
    data,
    loading,
    isToggling,
    isUpdatingJob,
    handleToggleOnline,
    handleUpdateJobStatus,
    refreshDashboard,
  } = useDashboard();

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <DashHeader
        mechanicName={data?.mechanicName}
        status={data?.mechanicStatus}
        onToggleOnline={handleToggleOnline}
        isToggling={isToggling}
        onRefresh={refreshDashboard}
      />

      {/* STATS CARDS */}
      <DashStats stats={data?.stats} />

      {/* MAIN CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: ACTIVE JOBS & FINANCIAL SECTION (8 Cols) */}
        <div className="lg:col-span-8 space-y-6">
          <ActiveJobs
            jobs={data?.activeJobs || []}
            onUpdateStatus={handleUpdateJobStatus}
            isUpdating={isUpdatingJob}
          />

          {/* FINANCIAL SECTION GRID */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
            <div className="md:col-span-7">
              <FinancialChart data={data?.financialChart || []} />
            </div>
            <div className="md:col-span-5">
              <FinancialSummary summary={data?.financialSummary} />
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: QUICK ACTIONS & RECENT ACTIVITIES (4 Cols) */}
        <div className="lg:col-span-4 space-y-6">
          <QuickAction />
          <RecentActivities activities={data?.recentActivities || []} />
        </div>
      </div>
    </div>
  );
}
