import ProfileView from "@/features/profile/views/ProfileView";
import { getProfile } from "@/features/profile/services/profile.action";

export const metadata = {
  title: "Profil Saya | Servis Montir",
  description:
    "Pengaturan profil montir, area operasional, dan keahlian perbaikan.",
};

export default async function ProfilePage() {
  // Fetch data profil langsung dari Server
  const res = await getProfile();
  const initialData = res.success ? res.data : null;

  return <ProfileView initialData={initialData} />;
}
