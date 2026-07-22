import Link from "next/link";
import { Mail } from "lucide-react";

import { Button, Input } from "@/components/ui";
import PasswordInput from "./PasswordInput";

export default function LoginForm() {
  return (
    <div className="w-full max-w-md">

      <h1 className="text-5xl font-bold text-slate-900">
        Welcome Back
      </h1>

      <p className="mt-2 text-slate-500">
        Kendaraanmu kenapa lagi?
      </p>

      <form className="mt-10 space-y-6">

        {/* Email */}
        <div>

          <label className="text-sm font-medium">
            Email
          </label>

          <div className="mt-2 flex items-center rounded-md border bg-white px-4">

            <Mail
              size={18}
              className="text-slate-400"
            />

            <Input
              type="email"
              placeholder="email@example.com"
              className="border-none shadow-none focus-visible:ring-0"
            />

          </div>

        </div>

        {/* Password */}
        <PasswordInput />

        {/* Remember */}
        <div className="flex items-center justify-between text-sm">

          <label className="flex items-center gap-2">

            <input type="checkbox" />

            Remember me

          </label>

          <Link
            href="/forgot-password"
            className="text-blue-600 hover:underline"
          >
            Forgot Password?
          </Link>

        </div>

        {/* Login */}
        <Button
          className="w-full"
          type="submit"
        >
          Login
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

      {/* Register */}

      <Button
        variant="outline"
        className="w-full"
        asChild
      >
        <Link href="/register">
          Create New Account
        </Link>
      </Button>

    </div>
  );
}