export const QuickAction = () => (
  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <h3 class="text-base font-bold text-slate-800 mb-3">Aksi Cepat</h3>
    <div class="grid grid-cols-2 gap-2">
      <button class="p-3 bg-indigo-600 text-white rounded-sm text-xs font-semibold hover:bg-indigo-700 transition-all">
        + Buat Servis Baru
      </button>
      <button class="p-3 bg-slate-100 text-slate-700 rounded-sm text-xs font-semibold hover:bg-slate-200 transition-all">
        Cek Antrean Workshop
      </button>
    </div>
  </div>
);