import Link from "next/link";
import { Mail, Lock } from "lucide-react";
import { Button, Input } from "@/components/ui";
import PasswordInput from "@/features/auth/components/PasswordInput";

export default function RegisterForm() {
  return (
    <div className="w-full max-w-md p-20px">
      <h1 className="text-5xl font-bold text-slate-900">
        Welcome
      </h1>

      <p className="mt-2 text-slate-500">
        Yuk mulai permudah hidupmu!
      </p>

      <form className="mt-10 space-y-6">
        <div>

          <label className="text-sm font-medium">
            Email
          </label>

          <div className="mt-2 flex items-center rounded-sm border bg-white px-4">

            <Mail
              size={18}
              className="text-slate-400"
            />

            <Input
              type="email"
              placeholder="email@example.com"
              className="w-full bg-transparent p-3 outline-none border-none hover:none"
            />
          </div>
        </div>

        <div>
          <PasswordInput />
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

      <Button variant="secondary" size="sm" href="">
        Register
      </Button>

    </div>
  );
}