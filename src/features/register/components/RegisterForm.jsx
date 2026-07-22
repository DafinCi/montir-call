import Link from "next/link";
import { Mail, User } from "lucide-react";

import { Button, Input } from "@/components/ui";
import PasswordInput from "@/features/auth/components/PasswordInput";

export default function RegisterForm() {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-5xl font-bold text-slate-900">
        Create Account
      </h1>

      <p className="mt-2 text-slate-500">
        Yuk mulai permudah hidupmu!
      </p>

      <form className="mt-8 space-y-5">
        {/* Full Name */}
        <div>
          <label className="text-sm font-medium">
            Full Name
          </label>

          <div className="mt-2 flex items-center rounded-md border bg-white px-4">
            <User size={18} className="text-slate-400" />

            <Input
              type="text"
              placeholder="John Doe"
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="text-sm font-medium">
            Email
          </label>

          <div className="mt-2 flex items-center rounded-md border bg-white px-4">
            <Mail size={18} className="text-slate-400" />

            <Input
              type="email"
              placeholder="email@example.com"
              className="border-none shadow-none focus-visible:ring-0"
            />
          </div>
        </div>

        {/* Password */}
        <PasswordInput
          label="Password"
          placeholder="Masukkan password"
        />

        {/* Confirm Password */}
        <PasswordInput
          label="Confirm Password"
          placeholder="Ulangi password"
        />

        {/* Terms */}
        <label className="flex items-start gap-2 text-sm">
          <input type="checkbox" className="mt-1" />

          <span className="text-slate-600">
            Saya menyetujui{" "}
            <Link
              href="/terms"
              className="font-medium text-blue-600 hover:underline"
            >
              Terms of Service
            </Link>{" "}
            dan{" "}
            <Link
              href="/privacy"
              className="font-medium text-blue-600 hover:underline"
            >
              Privacy Policy
            </Link>
          </span>
        </label>

        {/* Register Button */}
        <Button className="w-full" type="submit">
          Register
        </Button>
      </form>

      {/* Divider */}
      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="px-4 text-sm text-slate-400">
          OR
        </span>

        <div className="h-px flex-1 bg-slate-200" />
      </div>

      {/* Google */}
      <Button
        variant="outline"
        className="w-full"
        type="button"
      >
        Continue with Google
      </Button>

      {/* Login */}
      <p className="mt-8 text-center text-sm text-slate-500">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-blue-600 hover:underline"
        >
          Login
        </Link>
      </p>
    </div>
  );
}