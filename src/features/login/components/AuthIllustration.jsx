import { Wrench, MapPinned } from "lucide-react";

export default function AuthIllustration() {
  return (
    <section className="hidden lg:flex flex-col justify-between bg-blue-600 text-white p-16">
      <div>
    
        <div className="flex items-center gap-3">
            
          <div className="rounded-xl bg-white/20 p-3">
            <Wrench size={28} />
          </div>

          <h1 className="text-3xl font-bold">
            MontirGo
          </h1>
        </div>
      </div>

      <div>
        <h2 className="text-5xl font-bold leading-tight">
          Bantu pelanggan
          <br />
          lebih cepat
          <br />
          dengan lokasi realtime.
        </h2>

        <p className="mt-6 text-blue-100">
          Terima order, navigasi ke lokasi pelanggan,
          dan kelola pekerjaan dalam satu dashboard.
        </p>
      </div>

      <div className="flex items-center gap-2 text-blue-100">
        <MapPinned />
        <span>Realtime Location Tracking</span>
      </div>
    </section>
  );
}