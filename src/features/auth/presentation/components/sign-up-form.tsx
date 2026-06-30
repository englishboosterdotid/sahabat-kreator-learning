import { Button, Input, Label} from "@/components/ui";
import { signUpAction } from "../actions";

export function SignUpForm() {
  return (
    <form action={signUpAction} className="space-y-5">
      <div className="space-y-2">
        <Label required>Name</Label>
        <Input name="name" />
      </div>

      <div className="space-y-2">
        <Label required>Email</Label>
        <Input
          name="email"
          type="email"
        />
      </div>

      <div className="space-y-2">
        <Label required>Password</Label>
        <Input
          name="password"
          type="password"
        />
      </div>

      <Button className="w-full">
        Create Account
      </Button>
    </form>
  );
}