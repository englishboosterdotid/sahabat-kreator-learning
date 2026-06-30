import { AuthCard } from "@/features/auth/presentation/components/auth-card";
import { SignUpForm } from "@/features/auth/presentation/components/sign-up-form";

export default function SignUpPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
      <AuthCard
        title="Create Account"
        description="Buat akun baru untuk memulai."
      >
        <SignUpForm />
      </AuthCard>
    </main>
  );
}