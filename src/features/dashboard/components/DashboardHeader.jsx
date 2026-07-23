export const DashboardHeader = ({ mechanicName = 'Montir Express' }) => (
  <div class="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
    <div>
      <h1 class="text-2xl font-bold text-slate-800">Halo, {mechanicName} </h1>
      <p class="text-slate-500 text-sm">Siap melayani pelanggan dan menangani panggilan hari ini?</p>
    </div>
  </div>
);