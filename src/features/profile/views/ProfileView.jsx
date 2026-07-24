"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";
import ProfileSpecialties from "../components/ProfileSpecialties";
import ProfileSkeleton from "../skeleton/ProfileSkeleton";

export default function ProfileView() {
// State Loading & Action
  const [isLoading, setIsLoading] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  // State Data Profil
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    workshop: "",
    bankAccount: "",
    address: "",
  });
  const [selectedSkills, setSelectedSkills] = useState([]);
  const [radius, setRadius] = useState(10);

  // 2. Simulasi Fetch Data dari Supabase / API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        
        // Simulasi delay network selama 1.5 detik
        await new Promise((resolve) => setTimeout(resolve, 1500));

        // Set data dari database / API
        setFormData({
          name: "",
          phone: "",
          email: "",
          workshop: "",
          bankAccount: "",
          address: "",
        });

        setSelectedSkills([
          "",
        ]);

        setRadius(12);
      } catch (error) {
        console.error("Gagal memuat data profil:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  // Handler Form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  if (isLoading) {
  return <ProfileSkeleton />;
  }

  return (
  <>
    <ProfileHeader user={formData} />
    <form onSubmit={handleSubmit} className="p-4 md:p-8 max-w-5xl mx-auto space-y-6">
      {/* HEADER SECTION */}

      {/* FORM CONTENT GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* LEFT COLUMN: Data Utama (7 Cols) */}
        <Card className="lg:col-span-7 shadow-xs">
          <CardContent className="p-6">
            <ProfileForm formData={formData} onChange={handleInputChange} />
          </CardContent>
        </Card>

        {/* RIGHT COLUMN: Keahlian & Preferensi (5 Cols) */}
        <Card className="lg:col-span-5 shadow-xs">
          <CardContent className="p-6">
            <ProfileSpecialties
              selectedSkills={selectedSkills}
              onToggleSkill={handleToggleSkill}
              radius={radius}
              onRadiusChange={setRadius}
            />
          </CardContent>
        </Card>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="flex items-center justify-between p-4 rounded-sm border bg-card text-card-foreground shadow-xs">
        <p className="text-xs text-muted-foreground hidden sm:block">
          Pastikan seluruh nomor kontak dan area layanan sudah tepat.
        </p>

        <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
          <Button type="button" variant="outline" size="sm" className="gap-1.5 text-xs">
            <RotateCcw className="size-3.5" /> Batal
          </Button>

          <Button type="submit" size="sm" className="gap-1.5 text-xs font-semibold shadow-xs">
            {isSaved ? (
              <>
                <CheckCircle2 className="size-3.5 text-secondary animate-bounce" /> Tersimpan!
              </>
            ) : (
              <>
                <Save className="size-3.5" /> Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>
    </form>
  </>
  );
}