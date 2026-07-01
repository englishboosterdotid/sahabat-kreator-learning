import Image from "next/image";
import Link from "next/link";

import { AuthCard } from "@/features/auth/presentation/components/auth-card";
import { SignInForm } from "@/features/auth/presentation/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-6 py-10 dark:bg-zinc-950">
      <div className="w-full max-w-md">
        <div className="mb-8 flex flex-col items-center">
          <Link href="/" className="transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Sahabat Kreator"
              width={72}
              height={72}
              priority
              className="h-18 w-18 object-contain"
            />
          </Link>

          <h1 className="mt-4 text-2xl font-bold tracking-tight text-zinc-900 dark:text-white">
            Sahabat Kreator
          </h1>

          <p className="mt-2 text-center text-sm text-zinc-600 dark:text-zinc-400">
            AI Workspace untuk Agency & Freelance Social Media Manager
          </p>
        </div>

        <AuthCard
          title="Welcome Back"
          description="Masuk ke akun Sahabat Kreator."
        >
          <SignInForm />

          <p className="mt-6 text-center text-sm text-zinc-600 dark:text-zinc-400">
            Belum punya akun?{" "}
            <Link
              href="/sign-up"
              className="font-medium text-primary transition-colors hover:underline"
            >
              Daftar sekarang
            </Link>
          </p>
        </AuthCard>
      </div>
    </main>
  );
}