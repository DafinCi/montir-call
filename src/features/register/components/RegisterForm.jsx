import Link from "next/link";
import { Mail, User, ArrowLeft } from "lucide-react";

import { Button, Input } from "@/components/ui";
import PasswordInput from "@/features/auth/components/PasswordInput";

export default function RegisterForm() {
  return (
    <div className="w-full max-w-md">
      <Link
      href="/login"
      className="mb-8 fixed items-center mt-[-10] ml-[-40] text-sm w-6 text-slate-500 transition-all duration-300 hover:text-black hover:-translate-x-4" 
      >
        <ArrowLeft size={18}/>
      </Link>

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

        {/* Register Button */}
        <Button className="w-full" type="submit" variant="secondary">
          Register
        </Button>
      </form>
    </div>
  );
}