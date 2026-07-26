import RequestsView from "@/features/request/views/RequestsView";

export const metadata = {
  title: "Permintaan Servis | Dashboard Montir",
  description:
    "Kelola dan terima panggilan perbaikan darurat kendaraan pelanggan.",
};

export default function RequestsPage() {
  return <RequestsView />;
}
