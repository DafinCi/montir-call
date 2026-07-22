import { Wrench, MapPinned } from "lucide-react";

export default function AuthIllustration() {
  return (
    <section className="hidden lg:flex flex-col justify-center bg-secondary text-white p-16">
      <div>
    
        <div className="flex items-center gap-3">
            
          <div className="rounded-sm bg-white/20 p-3">
            <Wrench size={28} />
          </div>

          <h1 className="text-3xl font-bold">
            MontirGo
          </h1>
        </div>
      </div>

      <div>
        <h2 className="text-5xl font-bold leading-tight mt-[20px]">
          Bantu pelanggan
          <br />
          lebih cepat
          <br />
          dengan lokasi realtime.
        </h2>
      </div>
    </section>
  );
}