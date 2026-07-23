export const ActiveJobs = ({ jobs }) => (
  <div class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-base font-bold text-slate-800">Panggilan Servis Aktif</h3>
      <span class="text-xs bg-amber-50 text-amber-600 font-semibold px-2.5 py-1 rounded-full">
        {jobs.length} Tugas
      </span>
    </div>
    <div class="space-y-3">
      {jobs.map((job) => (
        <div key={job.id} class="p-3 bg-slate-50 rounded-sm border border-slate-100 flex flex-col gap-1">
          <div class="flex justify-between items-center">
            <span class="text-xs font-bold text-indigo-600">{job.id}</span>
            <span class="text-[11px] font-semibold bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md">
              {job.status}
            </span>
          </div>
          <p class="text-sm font-bold text-slate-800">{job.customer} - <span class="font-normal text-slate-600">{job.vehicle}</span></p>
          <p class="text-xs text-slate-500">🛠️ {job.service}</p>
          <p class="text-xs text-slate-400 mt-1">📍 {job.address}</p>
        </div>
      ))}
    </div>
  </div>
);