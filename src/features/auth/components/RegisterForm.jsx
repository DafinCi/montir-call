"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Mail,
  User,
  Phone,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "./PasswordInput";
import { registerMechanic } from "../services/auth.action";

export default function RegisterForm() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      const res = await registerMechanic(formData);
      if (res?.success) {
        setIsSuccess(true);
        setTimeout(() => {
          router.push("/login");
        }, 2000);
      } else if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  if (isSuccess) {
    return (
      <div className="w-full max-w-sm text-center space-y-4 py-8">
        <CheckCircle2 className="size-12 text-emerald-500 mx-auto animate-bounce" />
        <h2 className="text-xl font-bold">Pendaftaran Berhasil!</h2>
        <p className="text-xs text-muted-foreground">
          Akun mitra Anda telah dibuat. Mengalihkan Anda ke halaman login...
        </p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Daftar Mitra Montir
        </h1>
        <p className="text-xs text-muted-foreground">
          Bergabung bersama MontirGo dan dapatkan order servis darurat.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-xs text-destructive font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Nama Lengkap */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Nama Lengkap
          </label>
          <div className="flex items-center rounded-lg border bg-background px-3 focus-within:ring-2 focus-within:ring-primary transition-all">
            <User size={16} className="mr-2.5 text-muted-foreground shrink-0" />
            <Input
              name="name"
              required
              placeholder="Budi Santoso"
              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10 text-sm"
            />
          </div>
        </div>

        {/* No WhatsApp / HP */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">
            Nomor WhatsApp
          </label>
          <div className="flex items-center rounded-lg border bg-background px-3 focus-within:ring-2 focus-within:ring-primary transition-all">
            <Phone
              size={16}
              className="mr-2.5 text-muted-foreground shrink-0"
            />
            <Input
              name="phone"
              type="tel"
              required
              placeholder="081234567890"
              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10 text-sm"
            />
          </div>
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-foreground">Email</label>
          <div className="flex items-center rounded-lg border bg-background px-3 focus-within:ring-2 focus-within:ring-primary transition-all">
            <Mail size={16} className="mr-2.5 text-muted-foreground shrink-0" />
            <Input
              name="email"
              type="email"
              required
              placeholder="nama@domain.com"
              className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10 text-sm"
            />
          </div>
        </div>

        {/* Password */}
        <PasswordInput name="password" required />

        {/* Submit */}
        <Button
          type="submit"
          disabled={isPending}
          className="w-full font-semibold shadow-xs"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Mendaftarkan...
            </>
          ) : (
            "Daftar Sekarang"
          )}
        </Button>
      </form>

      <div className="text-center text-xs text-muted-foreground">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="text-primary font-semibold hover:underline"
        >
          Masuk di sini
        </Link>
      </div>
    </div>
  );
}
