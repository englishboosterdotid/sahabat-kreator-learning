import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui";
import { PlatformIcon, getPlatformTint, type SocialPlatform } from "./platform-icon";
import { listReplizConnectionsByTeam } from "@/features/repliz/application/services/repliz-connection-service";
import { disconnectReplizConnection } from "@/features/repliz/presentation/actions";

type ReplizLocalConnectionListProps = {
  teamId: string;
};

export async function ReplizLocalConnectionList({
  teamId,
}: ReplizLocalConnectionListProps) {
  const items = await listReplizConnectionsByTeam(teamId);

  if (items.length === 0) {
    return (
      <Card className="rounded-2xl">
        <CardContent className="flex flex-col items-center gap-5 py-16 text-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-zinc-100 dark:bg-zinc-800">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="28"
              height="28"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-zinc-400"
            >
              <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
              <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
            </svg>
          </div>
          <div className="flex flex-col gap-1.5">
            <CardTitle className="text-lg font-semibold">
              Belum ada akun terhubung
            </CardTitle>
            <CardDescription className="mx-auto" style={{ maxWidth: 460 }}>
              Hubungkan akun Facebook, Instagram, Threads, TikTok, YouTube, atau
              LinkedIn untuk mulai mengelola konten.
            </CardDescription>
          </div>
          <a
            href="#connect"
            className="inline-flex h-10 items-center justify-center rounded-xl border border-transparent bg-zinc-100 px-5 text-sm font-medium text-zinc-900 transition-colors hover:bg-zinc-200 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
          >
            Hubungkan Akun
          </a>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2 2xl:grid-cols-3">
      {items.map((item) => (
        <Card
          key={item.id}
          className="rounded-2xl transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <CardContent className="flex flex-col gap-4 p-5">
            {/* Platform badge */}
            <span className="inline-flex w-fit rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium capitalize dark:bg-zinc-800 dark:text-zinc-300">
              {item.platform}
            </span>

            {/* Avatar / Icon */}
            {item.externalPicture ? (
              <div className="flex h-12 w-12 items-center justify-center overflow-hidden rounded-full ring-1 ring-zinc-200 dark:ring-zinc-800">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={item.externalPicture}
                  alt={item.externalName}
                  className="h-full w-full object-cover"
                  loading="lazy"
                  referrerPolicy="no-referrer"
                />
              </div>
            ) : (
              <div
                className={`flex h-12 w-12 items-center justify-center rounded-xl ${getPlatformTint(item.platform as SocialPlatform)}`}
              >
                <PlatformIcon
                  platform={item.platform as SocialPlatform}
                  size={22}
                  weight="regular"
                />
              </div>
            )}

            <div className="flex flex-col gap-1">
              <div className="break-words text-base font-semibold text-zinc-900 dark:text-zinc-50">
                {item.externalName}
              </div>
              {item.externalUsername ? (
                <div className="break-all text-sm text-zinc-500 dark:text-zinc-400">
                  @{item.externalUsername}
                </div>
              ) : null}
            </div>

            {/* Status badge */}
            {item.isConnected ? (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-green-100 px-2.5 py-1 text-xs font-medium text-green-700 dark:bg-green-900/30 dark:text-green-400">
                <span className="h-1.5 w-1.5 rounded-full bg-green-600 dark:bg-green-400" />
                Connected
              </span>
            ) : (
              <span className="inline-flex w-fit items-center gap-1.5 rounded-full bg-red-100 px-2.5 py-1 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
                <span className="h-1.5 w-1.5 rounded-full bg-red-600 dark:bg-red-400" />
                Disconnected
              </span>
            )}

            {/* Action button */}
            {item.isConnected ? (
              <form action={disconnectReplizConnection}>
                <input type="hidden" name="id" value={item.id} />
                <Button
                  variant="ghost"
                  size="sm"
                  className="self-start text-red-600 hover:bg-red-100 hover:text-red-700 dark:text-red-400 dark:hover:bg-red-900/30 dark:hover:text-red-300"
                >
                  Disconnect
                </Button>
              </form>
            ) : (
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="self-start text-zinc-700 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800 dark:hover:text-zinc-50"
              >
                <a href={`/api/integrations/repliz/authorize?platform=${item.platform}`}>
                  Reconnect
                </a>
              </Button>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
