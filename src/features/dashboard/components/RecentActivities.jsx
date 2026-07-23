export const RecentActivities = ({ activities }) => (
  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <h3 class="text-base font-bold text-slate-800 mb-4">Aktivitas Terakhir</h3>
    <div class="space-y-3">
      {activities.map((act) => (
        <div key={act.id} class="flex items-start gap-3">
          <div class="w-2 h-2 rounded-full bg-indigo-500 mt-1.5"></div>
          <div>
            <p class="text-xs text-slate-700 font-medium">{act.text}</p>
            <span class="text-[10px] text-slate-400">{act.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);