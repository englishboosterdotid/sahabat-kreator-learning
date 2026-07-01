import { Button, Input, Label, PasswordInput} from "@/components/ui";
import { signInAction } from "../actions";

export function SignInForm() {
  return (
    <form action={signInAction} className="space-y-5">
      <div className="space-y-2">
        <Label required>Email</Label>

        <Input
          name="email"
          type="email"
          placeholder="you@example.com"
        />
      </div>

      <div className="space-y-2">
        <Label required>Password</Label>

       <PasswordInput
  name="password"
  placeholder="••••••••"
  autoComplete="current-password"
/>
      </div>

      <Button className="w-full">
        Sign In
      </Button>
    </form>
  );
}