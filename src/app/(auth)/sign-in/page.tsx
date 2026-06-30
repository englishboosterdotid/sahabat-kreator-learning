import { AuthCard } from "@/features/auth/presentation/components/auth-card";
import { SignInForm } from "@/features/auth/presentation/components/sign-in-form";

export default function SignInPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-6 dark:bg-zinc-950">
      <AuthCard
        title="Welcome Back"
        description="Masuk ke akun Sahabat Kreator."
      >
        <SignInForm />
      </AuthCard>
    </main>
  );
}