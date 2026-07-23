export const ChartSkeleton = () => (
  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm animate-pulse h-64 flex flex-col justify-between">
    <div class="h-5 bg-slate-200 rounded w-1/4 mb-4"></div>
    <div class="flex items-end gap-3 h-40">
      <div class="bg-slate-200 w-full h-1/2 rounded"></div>
      <div class="bg-slate-200 w-full h-3/4 rounded"></div>
      <div class="bg-slate-200 w-full h-2/3 rounded"></div>
      <div class="bg-slate-200 w-full h-full rounded"></div>
    </div>
  </div>
);