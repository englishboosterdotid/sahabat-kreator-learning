import { Button, Input, Label, PasswordInput} from "@/components/ui";
import { signUpAction } from "../actions";

export function SignUpForm() {
  return (
    <form action={signUpAction} className="space-y-5">
      <div className="space-y-2">
        <Label required>Name</Label>
        <Input name="name" placeholder="Your Name" />
      </div>

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
  autoComplete="new-password"
/>
      </div>

      <Button className="w-full">
        Create Account
      </Button>
    </form>
  );
}