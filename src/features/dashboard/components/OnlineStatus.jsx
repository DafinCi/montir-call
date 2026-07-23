export const OnlineStatus = ({ isOnline, onToggle }) => (
  <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class={`w-3 h-3 rounded-full ${isOnline ? 'bg-emerald-500 animate-ping' : 'bg-slate-300'}`}></span>
      <div>
        <p class="text-xs text-slate-400 font-medium">STATUS MONTIR</p>
        <p class="text-sm font-semibold text-slate-700">{isOnline ? 'Siap Terima Order' : 'Off / Istirahat'}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      class={`px-4 py-2 rounded-sm text-xs font-semibold transition-all duration-300 ${
        isOnline
          ? 'bg-emerald-50 text-emerald-600 border border-emerald-200 hover:bg-emerald-100'
          : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
      }`}
    >
      {isOnline ? 'Matikan Status' : 'Aktifkan Montir'}
    </button>
  </div>
);