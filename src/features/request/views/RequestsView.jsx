"use client";

import React, { useState } from "react";
import { Wrench, Inbox } from "lucide-react";
import JobRequestCard from "../components/JobRequestCard";
import JobDetailSheet from "../components/JobDetailSheet";
import JobFilterBar from "../components/JobFilterBar";
import RequestsSkeleton from "../skeleton/RequestsSkeleton";

// Dummy Operational Data
const DUMMY_REQUESTS = [
  {
    id: "REQ-8821",
    customerName: "Budi Santoso",
    createdAt: "10 menit lalu",
    priority: "emergency",
    vehicleModel: "Honda Vario 125 (2020)",
    licensePlate: "H 4521 AW",
    problemDescription: "Motor mati mendadak saat lampu merah. Starter tidak merespon, indikator aki berkedip.",
    symptoms: ["Mogok Total", "Aki Tekor", "Sistem Kelistrikan"],
    locationTitle: "Depan Minimarket Pemuda",
    locationAddress: "Jl. Pemuda No. 102, Sekayu, Semarang Tengah",
    distanceKm: "2.4",
    estimatedTime: "8 min",
    customerNote: "Tolong bawa aki cadangan atau alat jumper."
  },
  {
    id: "REQ-8820",
    customerName: "Siti Rahmawati",
    createdAt: "25 menit lalu",
    priority: "scheduled",
    vehicleModel: "Yamaha NMAX 155",
    licensePlate: "K 9012 BT",
    problemDescription: "Servis rutin ganti oli mesin & oli gardan + cek rem belakang bunyi berdecit.",
    symptoms: ["Ganti Oli", "Cek Rem"],
    locationTitle: "Perumahan Graha Candi",
    locationAddress: "Jl. Candi Golf Blok A-4, Candisari, Semarang",
    distanceKm: "5.1",
    estimatedTime: "15 min",
    customerNote: "Bisa dikerjakan pukul 14:00 sore."
  },
  {
    id: "REQ-8819",
    customerName: "Hendrik Wijaya",
    createdAt: "45 menit lalu",
    priority: "emergency",
    vehicleModel: "Toyota Avanza G (2018)",
    licensePlate: "B 1289 POK",
    problemDescription: "Ban depan kanan kempes kena paku di bahu jalan. Perlu bantuan tambal / ganti ban serep.",
    symptoms: ["Ban Kempes", "Perlu Dongkrak"],
    locationTitle: "Pinggir Jalan Pandanaran",
    locationAddress: "Jl. Pandanaran No. 45 (Depan Toko oleh-oleh)",
    distanceKm: "3.8",
    estimatedTime: "12 min",
    customerNote: "Mobil terparkir di pinggir jalan ramai."
  }
];

export default function RequestsView() {
  const [requests, setRequests] = useState(DUMMY_REQUESTS);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);

  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      setIsRefreshing(false);
    }, 1000);
  };

  const handleAcceptJob = (jobId) => {
    alert(`Permintaan #${jobId} berhasil diterima! Pesanan berpindah ke Active Jobs.`);
    setRequests((prev) => prev.filter((r) => r.id !== jobId));
  };

  // Filtering Logic
  const filteredRequests = requests.filter((job) => {
    const matchesSearch =
      job.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.licensePlate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.locationAddress.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.vehicleModel.toLowerCase().includes(searchQuery.toLowerCase());

    if (activeTab === "emergency") {
      return matchesSearch && job.priority === "emergency";
    }
    if (activeTab === "scheduled") {
      return matchesSearch && job.priority === "scheduled";
    }

    return matchesSearch;
  });

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      
      {/* Page Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-card-foreground flex items-center gap-2">
            <Wrench className="size-5 text-secondary" /> Permintaan Masuk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar panggilan servis darurat dan perbaikan terjadwal di sekitar lokasi Anda.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <JobFilterBar
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
      />

      {/* Content Feed */}
      {isLoading ? (
        <RequestsSkeleton />
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredRequests.map((job) => (
            <JobRequestCard
              key={job.id}
              job={job}
              onSelect={setSelectedJob}
              onAccept={handleAcceptJob}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="flex flex-col items-center justify-center p-12 text-center rounded-2xl border border-dashed bg-card/50 text-muted-foreground space-y-3">
          <div className="p-3 rounded-full bg-muted/30">
            <Inbox className="size-8 text-muted-foreground/60" />
          </div>
          <div className="space-y-1">
            <h3 className="text-sm font-semibold text-card-foreground">Tidak ada permintaan servis</h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Saat ini belum ada panggilan baru yang sesuai dengan filter atau pencarian Anda.
            </p>
          </div>
        </div>
      )}

      {/* Detail Slide-Over Sheet */}
      <JobDetailSheet
        job={selectedJob}
        isOpen={!!selectedJob}
        onClose={() => setSelectedJob(null)}
        onAccept={handleAcceptJob}
      />
    </div>
  );
}