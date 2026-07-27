"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { Mail, Loader2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import PasswordInput from "./PasswordInput";
import { loginMechanic } from "../services/auth.action";

export default function LoginForm() {
  const [isPending, startTransition] = useTransition();
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");

    const formData = new FormData(e.currentTarget);

    startTransition(async () => {
      // Jika berhasil, Server Action akan otomatis melakukan redirect("/dashboard")
      const res = await loginMechanic(formData);

      // Jika res ada (artinya return object error), tampilkan pesan kesalahan
      if (res?.error) {
        setErrorMessage(res.error);
      }
    });
  };

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl tracking-tight text-muted font-ubuntu font-bold">
          Portal Montir
        </h1>
        <p className="text-xs text-muted-foreground">
          Yuk cek Jasa apa yang kamu bisa jual hari ini.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 rounded-lg bg-destructive/10 border border-destructive/20 flex items-center gap-2 text-xs text-destructive font-medium">
          <AlertCircle size={16} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Email */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-muted-foreground">
            Email Mitra
          </label>
          <div className="flex items-center rounded-lg border bg-chart-1/20 px-3 focus-within:ring-2 focus-within:ring-primary transition-all">
            <Mail size={16} className="mr-2.5 text-muted-foreground shrink-0" />
            <Input
              name="email"
              type="email"
              required
              placeholder="montir@montirgo.com"
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
              Memproses...
            </>
          ) : (
            "Masuk Dashboard"
          )}
        </Button>
      </form>

      <div className="relative flex items-center justify-center">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <span className="relative px-2 text-[10px] uppercase tracking-wider text-muted-foreground">
          Belum jadi mitra?
        </span>
      </div>

      <Button className="w-full text-semibold text-primary" asChild>
        <Link href="/register">Daftar Sebagai Mitra Montir</Link>
      </Button>
    </div>
  );
}
