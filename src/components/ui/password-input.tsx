"use client";

import * as React from "react";
import { Eye, EyeSlash } from "@phosphor-icons/react";

import { Input, type InputProps } from "./input";
import { cn } from "@/lib/utils";

export function PasswordInput({
  className,
  ...props
}: InputProps) {
  const [showPassword, setShowPassword] = React.useState(false);

  return (
    <div className="relative">
      <Input
        {...props}
        type={showPassword ? "text" : "password"}
        className={cn("pr-11", className)}
      />

      <button
        type="button"
        onClick={() => setShowPassword((prev) => !prev)}
        className="absolute inset-y-0 right-0 flex w-11 items-center justify-center text-zinc-500 transition-colors hover:text-zinc-700 dark:text-zinc-400 dark:hover:text-zinc-200"
        aria-label={
          showPassword ? "Sembunyikan password" : "Tampilkan password"
        }
      >
        {showPassword ? (
          <EyeSlash size={20} weight="regular" />
        ) : (
          <Eye size={20} weight="regular" />
        )}
      </button>
    </div>
  );
}