import { Button, Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui";

export default function MarketingPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 p-8 dark:bg-zinc-950">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Sahabat Kreator</CardTitle>

          <CardDescription>
            Platform AI untuk Social Media Agency.
          </CardDescription>
        </CardHeader>

        <CardContent>
          <p className="text-sm text-zinc-600 dark:text-zinc-300">
            Card ini akan menjadi dasar untuk Dashboard, Login,
            Analytics, Billing, dan halaman lainnya.
          </p>
        </CardContent>

        <CardFooter className="justify-end">
          <Button>Get Started</Button>
        </CardFooter>
      </Card>
    </main>
  );
}