export const FinancialChart = ({ data }) => {
  const maxVal = Math.max(...data.map((d) => d.amount));

  return (
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <h3 class="text-base font-bold text-slate-800 mb-4">Grafik Pendapatan (Rp)</h3>
      <div class="flex items-end justify-between gap-2 h-44 pt-4">
        {data.map((item, idx) => {
          const heightPercent = (item.amount / maxVal) * 100;
          return (
            <div key={idx} class="flex-1 flex flex-col items-center gap-2 h-full justify-end">
              <span class="text-[10px] text-slate-400">{(item.amount / 1000).toFixed(0)}k</span>
              <div
                style={{ height: `${heightPercent}%` }}
                class="w-full bg-emerald-500 hover:bg-emerald-600 rounded-t-md transition-all duration-300"
              ></div>
              <span class="text-xs font-medium text-slate-500">{item.day}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};