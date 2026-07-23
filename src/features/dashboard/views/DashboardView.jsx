"use client";

import { useDashboard } from '../hooks/UseDashboard';
import { DashboardHeader } from '../components/DashboardHeader';
import { OnlineStatus } from '../components/OnlineStatus';
import { DashboardStats } from '../components/DashStats';
import { FinancialSummary } from '../components/FinancialSummary';
import { JobChart } from '../components/JobChart';
import { FinancialChart } from '../components/FinancialChart';
import { ActiveJobs } from '../components/ActiveJobs';
import { RecentActivities } from '../components/RecentActivities';
import { QuickAction } from '../components/QuickAction';
import { DashboardSkeleton } from '../skeletons/DashboardSkeleton';

export const DashboardView = () => {
  const { data, loading, error, isOnline, handleToggleOnline } = useDashboard();

  if (loading) return <DashboardSkeleton />;
  if (error) return <div class="p-6 text-red-500 text-center">{error}</div>;

  return (
    <div class="min-h-screen bg-slate-50 p-4">
      <div class="max-w-7xl mx-auto space-y-6">
        
        {/* Header & Status Toggle */}
        <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <DashboardHeader mechanicName="Ahmad (Montir Pro)" />
          <OnlineStatus isOnline={isOnline} onToggle={handleToggleOnline} />
        </div>

        {/* Stats Grid */}
        <DashboardStats stats={data.stats} />

        {/* Action & Active Orders */}
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div class="lg:col-span-2 space-y-6">
            <ActiveJobs jobs={data.activeJobs} />
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <JobChart data={data.jobChart} />
              <FinancialChart data={data.financialChart} />
            </div>
          </div>

          <div class="space-y-6">
            <QuickAction />
            <FinancialSummary summary={data.financialSummary} />
            <RecentActivities activities={data.recentActivities} />
          </div>
        </div>

      </div>
    </div>
  );
};

export default DashboardView;