export const OnlineStatus = ({ isOnline, onToggle }) => (
  <div class="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm flex items-center justify-between">
    <div class="flex items-center gap-3">
      <span class={`w-3 h-3 rounded-full ${isOnline ? 'bg-secondary animate-ping' : 'bg-primary'}`}></span>
      <div>
        <p class="text-xs text-slate-400 font-medium">STATUS MONTIR</p>
        <p class="text-sm font-semibold text-slate-700">{isOnline ? 'Siap Terima Order' : 'Off / Istirahat'}</p>
      </div>
    </div>
    <button
      onClick={onToggle}
      class={`px-4 py-2 rounded-sm text-xs font-semibold transition-all duration-300 ${
        isOnline
          ? 'bg-primary text-secondary border border-secondary/20 hover:bg-emerald-100'
          : 'bg-primary text-slate-600 hover:bg-slate-200'
      }`}
    >
      {isOnline ? 'Matikan Status' : 'Aktifkan Montir'}
    </button>
  </div>
);