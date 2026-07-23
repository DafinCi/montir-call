import { CardSkeleton } from './CardSkeletons';
import { ChartSkeleton } from './ChartSkeleton';

export const DashboardSkeleton = () => (
  <div class="p-6 space-y-6 max-w-7xl mx-auto bg-slate-50 min-h-screen">
    <div class="h-10 bg-slate-200 rounded w-1/4 animate-pulse"></div>
    <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
      <CardSkeleton />
    </div>
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <ChartSkeleton />
      <ChartSkeleton />
    </div>
  </div>
);