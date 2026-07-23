export const FinancialSummary = ({ summary }) => (
  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <h3 class="text-base font-bold text-slate-800 mb-4">Ringkasan Pendapatan</h3>
    <div class="space-y-3">
      <div class="flex justify-between items-center pb-2 border-b border-slate-50">
        <span class="text-sm text-slate-500">Hari ini</span>
        <span class="text-sm font-semibold text-slate-700">Rp {summary.daily.toLocaleString('id-ID')}</span>
      </div>
      <div class="flex justify-between items-center pb-2 border-b border-slate-50">
        <span class="text-sm text-slate-500">Minggu ini</span>
        <span class="text-sm font-semibold text-slate-700">Rp {summary.weekly.toLocaleString('id-ID')}</span>
      </div>
      <div class="flex justify-between items-center">
        <span class="text-sm text-slate-500">Bulan ini</span>
        <span class="text-sm font-semibold text-emerald-600">Rp {summary.monthly.toLocaleString('id-ID')}</span>
      </div>
    </div>
  </div>
);