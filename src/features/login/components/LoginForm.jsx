import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function LoginForm() {
  return (
    <div className="w-full max-w-md">
      <h1 className="text-3xl font-bold text-slate-900">
        Welcome Back 👋
      </h1>

      <p className="mt-2 text-slate-500">
        Login untuk mulai menerima permintaan service.
      </p>

      <form className="mt-10 space-y-6">
        <div>

          <label className="text-sm font-medium">
            Email
          </label>

          <div className="mt-2 flex items-center rounded-xl border bg-white px-4">

            <Mail
              size={18}
              className="text-slate-400"
            />

            <Input
              type="email"
              placeholder="email@example.com"
              className="w-full bg-transparent p-3 outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-sm font-medium">
            Password
          </label>

          <div className="mt-2 flex items-center rounded-xl border bg-white px-4">
            <Lock
              size={18}
              className="text-slate-400"
            />

            <Input
              type="password"
              placeholder="********"
              className="w-full bg-transparent p-3 outline-none"
            />
          </div>
        </div>

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

        <Button variant="secondary" size="sm">
          Login
        </Button>
      </form>

      <div className="my-8 flex items-center">
        <div className="h-px flex-1 bg-slate-200" />

        <span className="px-4 text-sm text-slate-400">
          OR
        </span>
        <div className="h-px flex-1 bg-slate-200" />
      </div>

      <Button variant="secondary" size="sm">
        Continue with Google
      </Button>

      <p className="mt-8 text-center text-sm text-slate-500">
        Belum punya akun?

        <Link
          href="/register"
          className="ml-1 font-semibold text-blue-600"
        >
          Register
        </Link>
      </p>
    </div>
  );
}