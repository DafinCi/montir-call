"use client";

import React, { useState, useEffect } from "react";
import { Save, CheckCircle2, RotateCcw, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ProfileHeader from "../components/ProfileHeader";
import ProfileForm from "../components/ProfileForm";
import ProfileSpecialties from "../components/ProfileSpecialties";
import ProfileSkeleton from "../skeleton/ProfileSkeleton";
import {
  getProfile,
  updateProfile,
  uploadAvatar,
} from "../services/profile.action";

export default function ProfileView({ initialData }) {
  const [isLoading, setIsLoading] = useState(!initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  const [formData, setFormData] = useState(
    initialData || {
      name: "",
      phone: "",
      email: "",
      workshop: "",
      bankAccount: "",
      address: "",
      avatarUrl: "",
    },
  );
  const [selectedSkills, setSelectedSkills] = useState(
    initialData?.skills || [],
  );
  const [radius, setRadius] = useState(initialData?.radius || 10);

  useEffect(() => {
    if (!initialData) {
      const fetchProfileData = async () => {
        setIsLoading(true);
        const res = await getProfile();
        if (res.success && res.data) {
          setFormData(res.data);
          setSelectedSkills(res.data.skills || []);
          setRadius(res.data.radius || 10);
        }
        setIsLoading(false);
      };

      fetchProfileData();
    }
  }, [initialData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleToggleSkill = (skill) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill],
    );
  };

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const data = new FormData();
    data.append("file", file);

    const res = await uploadAvatar(data);
    if (res.success) {
      setFormData((prev) => ({ ...prev, avatarUrl: res.avatarUrl }));
    } else {
      alert(res.error || "Gagal memperbarui foto profil");
    }
  };

  const handleReset = () => {
    if (initialData) {
      setFormData(initialData);
      setSelectedSkills(initialData.skills || []);
      setRadius(initialData.radius || 10);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = {
      ...formData,
      skills: selectedSkills,
      radius: radius,
    };

    const res = await updateProfile(payload);
    setIsSubmitting(false);

    if (res.success) {
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } else {
      alert(res.error || "Gagal menyimpan perubahan");
    }
  };

  if (isLoading) {
    return <ProfileSkeleton />;
  }

  return (
    <>
      <ProfileHeader user={formData} onAvatarChange={handleAvatarChange} />
      <form
        onSubmit={handleSubmit}
        className="p-4 md:p-8 max-w-5xl mx-auto space-y-6"
      >
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* LEFT COLUMN: Data Utama (7 Cols) */}
          <Card className="lg:col-span-7 shadow-xs">
            <CardContent className="p-6">
              <ProfileForm formData={formData} onChange={handleInputChange} />
            </CardContent>
          </Card>

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

        <div className="flex items-center justify-between p-4 rounded-sm border bg-card text-card-foreground shadow-xs mb-15 sm:mb-0">
          <p className="text-xs text-muted-foreground hidden sm:block">
            Pastikan seluruh nomor kontak dan area layanan sudah tepat.
          </p>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleReset}
              disabled={isSubmitting}
              className="gap-1.5 text-xs"
            >
              <RotateCcw className="size-3.5" /> Batal
            </Button>

            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting}
              className="gap-1.5 text-xs font-semibold shadow-xs"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="size-3.5 animate-spin" /> Menyimpan...
                </>
              ) : isSaved ? (
                <>
                  <CheckCircle2 className="size-3.5 text-secondary animate-bounce" />{" "}
                  Tersimpan!
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
