"use client";

import { useState } from "react";
import { Eye, EyeOff, Lock } from "lucide-react";
import { Input } from "@/components/ui/input";

export default function PasswordInput({
  label = "Password",
  placeholder = "Masukkan password",
  name = "password",
  ...props
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-1.5">
      <label className="text-xs font-semibold text-muted-foreground">{label}</label>

      <div className="flex items-center rounded-lg border bg-chart-1/20 px-3 focus-within:ring-2 focus-within:ring-primary transition-all">
        <Lock size={16} className="mr-2.5 text-muted-foreground shrink-0" />

        <Input
          name={name}
          placeholder={placeholder}
          type={showPassword ? "text" : "password"}
          className="border-none shadow-none focus-visible:ring-0 focus-visible:ring-offset-0 px-0 h-10 text-sm"
          {...props}
        />

        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="text-muted-foreground hover:text-foreground transition-colors p-1"
        >
          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}
