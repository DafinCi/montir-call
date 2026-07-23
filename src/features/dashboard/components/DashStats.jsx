export const DashboardStats = ({ stats }) => (
  <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <p class="text-xs font-semibold text-slate-400">TOTAL ORDER HARI INI</p>
      <h3 class="text-2xl font-bold text-slate-800 mt-1">{stats.totalJobsToday} Order</h3>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <p class="text-xs font-semibold text-slate-400">SERVIS AKTIF</p>
      <h3 class="text-2xl font-bold text-amber-500 mt-1">{stats.activeJobs} Kendaraan</h3>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <p class="text-xs font-semibold text-slate-400">ESTIMASI PENDAPATAN</p>
      <h3 class="text-2xl font-bold text-emerald-600 mt-1">
        Rp {stats.todayRevenue.toLocaleString('id-ID')}
      </h3>
    </div>
    <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
      <p class="text-xs font-semibold text-slate-400">RATING PELANGGAN</p>
      <h3 class="text-2xl font-bold text-slate-800 mt-1"> {stats.rating} / 5.0</h3>
    </div>
  </div>
);