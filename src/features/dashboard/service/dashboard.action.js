// Simulasi delay jaringan (misal 1 detik)
const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export const fetchDashboardData = async () => {
  await delay(1000); // Simulasi request API

  return {
    stats: {
      totalJobsToday: 12,
      activeJobs: 4,
      todayRevenue: 850000,
      rating: 4.9,
    },
    onlineStatus: true,
    financialSummary: {
      daily: 850000,
      weekly: 4200000,
      monthly: 18500000,
    },
    jobChart: [
      { day: 'Sen', completed: 8 },
      { day: 'Sel', completed: 10 },
      { day: 'Rab', completed: 6 },
      { day: 'Kam', completed: 12 },
      { day: 'Jum', completed: 15 },
      { day: 'Sab', completed: 18 },
      { day: 'Min', completed: 12 },
    ],
    financialChart: [
      { day: 'Sen', amount: 400000 },
      { day: 'Sel', amount: 650000 },
      { day: 'Rab', amount: 350000 },
      { day: 'Kam', amount: 800000 },
      { day: 'Jum', amount: 1100000 },
      { day: 'Sab', amount: 1400000 },
      { day: 'Min', amount: 850000 },
    ],
    activeJobs: [
      {
        id: 'JOB-001',
        customer: 'Budi Santoso',
        vehicle: 'Honda Vario 125 (B 1234 CD)',
        service: 'Ganti Oli & Servis Rutin',
        status: 'Sedang Dikerjakan',
        address: 'Jl. Pemuda No. 12',
      },
      {
        id: 'JOB-002',
        customer: 'Siti Rahma',
        vehicle: 'Toyota Avanza (B 9876 XYZ)',
        service: 'Mogok - Aki Soak',
        status: 'Menuju Lokasi',
        address: 'Jl. Gatot Subroto Km 5',
      },
    ],
    recentActivities: [
      { id: 1, text: 'Selesai memperbaiki Honda Beat - Rp 150.000', time: '10 menit lalu' },
      { id: 2, text: 'Menerima pesanan baru dari Siti Rahma', time: '25 menit lalu' },
      { id: 3, text: 'Pembayaran diterima via QRIS - Rp 350.000', time: '1 jam lalu' },
    ],
  };
};

export const toggleMechanicStatus = async (currentStatus) => {
  await delay(500);
  return !currentStatus;
};