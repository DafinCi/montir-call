"use client";

import React, { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Wrench, Inbox } from "lucide-react";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import JobRequestCard from "../components/JobRequestCard";
import JobDetailSheet from "../components/JobDetailSheet";
import JobFilterBar from "../components/JobFilterBar";
import RequestsSkeleton from "../skeleton/RequestsSkeleton";
import { getPendingRequests, acceptRequest } from "../services/request.action";

export default function RequestsView() {
  const router = useRouter();
  const [requests, setRequests] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [acceptingId, setAcceptingId] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState("all");
  const [selectedJob, setSelectedJob] = useState(null);

  // Ambil data pesanan dari Supabase
  const loadRequests = useCallback(async () => {
    const res = await getPendingRequests();
    if (res.success) {
      setRequests(res.data);
    } else {
      toast.error(res.error || "Gagal memuat permintaan servis");
    }
    setIsLoading(false);
    setIsRefreshing(false);
  }, []);

  // Sync awal & daftarkan Supabase Realtime Subscription
  useEffect(() => {
    loadRequests();

    const supabase = createClient();
    const channel = supabase
      .channel("realtime-service-requests")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "service_requests",
        },
        () => {
          loadRequests();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [loadRequests]);

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadRequests();
  };

  const handleAcceptJob = async (jobId) => {
    setAcceptingId(jobId);
    const res = await acceptRequest(jobId);

    if (res.success) {
      toast.success(res.message);
      setRequests((prev) => prev.filter((r) => r.id !== jobId));
      if (selectedJob?.id === jobId) {
        setSelectedJob(null);
      }
      router.push("/dashboard");
    } else {
      toast.error(res.error);
      loadRequests();
    }
    setAcceptingId(null);
  };

  // 1. Kalkulasi Hitungan Jumlah (Counts) per Tab Filter
  const counts = useMemo(() => {
    const emergency = requests.filter(
      (j) => j.priority === "emergency" || j.isEmergency
    ).length;
    const scheduled = requests.filter(
      (j) => j.priority === "scheduled" && !j.isEmergency
    ).length;

    return {
      all: requests.length,
      emergency,
      scheduled,
    };
  }, [requests]);

  // 2. Logika Penyaringan Feed (Search & Active Tab)
  const filteredRequests = useMemo(() => {
    return requests.filter((job) => {
      const query = searchQuery.trim().toLowerCase();

      // Safe Null/Undefined Search Matching
      const matchesSearch =
        !query ||
        String(job.customerName || "").toLowerCase().includes(query) ||
        String(job.licensePlate || "").toLowerCase().includes(query) ||
        String(job.locationAddress || "").toLowerCase().includes(query) ||
        String(job.vehicleModel || "").toLowerCase().includes(query) ||
        String(job.problemDescription || "").toLowerCase().includes(query);

      const isEmergency = job.priority === "emergency" || job.isEmergency;

      if (activeTab === "emergency") {
        return matchesSearch && isEmergency;
      }
      if (activeTab === "scheduled") {
        return matchesSearch && !isEmergency;
      }

      return matchesSearch;
    });
  }, [requests, searchQuery, activeTab]);

  return (
    <div className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-border/60 pb-4">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-card-foreground flex items-center gap-2">
            <Wrench className="size-8 text-secondary" /> Permintaan Masuk
          </h1>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Daftar panggilan servis darurat dan perbaikan terjadwal di sekitar
            lokasi Anda.
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
        counts={counts}
      />

      {/* Content Feed */}
      {isLoading ? (
        <RequestsSkeleton />
      ) : filteredRequests.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-15 sm:mb-0">
          {filteredRequests.map((job) => (
            <JobRequestCard
              key={job.id}
              job={job}
              onSelect={setSelectedJob}
              onAccept={handleAcceptJob}
              isAccepting={acceptingId === job.id}
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
            <h3 className="text-sm font-semibold text-card-foreground">
              Tidak ada permintaan servis
            </h3>
            <p className="text-xs text-muted-foreground max-w-sm">
              Saat ini belum ada panggilan baru yang sesuai dengan filter atau
              pencarian Anda.
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
        isAccepting={acceptingId === selectedJob?.id}
      />
    </div>
  );
}