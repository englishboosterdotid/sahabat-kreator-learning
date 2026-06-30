import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui";

type AuthCardProps = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export function AuthCard({
  title,
  description,
  children,
}: AuthCardProps) {
  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <CardTitle>{title}</CardTitle>

        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          {description}
        </p>
      </CardHeader>

      <CardContent>{children}</CardContent>
    </Card>
  );
}