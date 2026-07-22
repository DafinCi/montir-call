"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Button, Input } from "@/components/ui";

export default function PasswordInput({
  label = "Password",
  placeholder = "Masukkan password",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-slate-700">
        {label}
      </label>

      <div className="flex items-center rounded-sm border border-slate-300 bg-white px-4  focus-within:ring-blue-100 transition">
        <Lock
          size={18}
          className="mr-3 text-slate-400"
        />

        <Input placeholder="******" className="border-none"
          type={showPassword ? "text" : "password"}
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-slate-400  transition"
        >
          {showPassword ? (
            <EyeOff size={18} />
          ) : (
            <Eye size={18} />
          )}
        </button>
      </div>
    </div>
  );
}