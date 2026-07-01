import { Button } from "@/components/ui/button";
import { PlatformIcon, getPlatformTint, type SocialPlatform } from "./platform-icon";

const platforms: Array<{ value: SocialPlatform; label: string; subtitle: string }> = [
  { value: "facebook", label: "Facebook", subtitle: "Hubungkan akun" },
  { value: "instagram", label: "Instagram", subtitle: "Hubungkan akun" },
  { value: "threads", label: "Threads", subtitle: "Hubungkan akun" },
  { value: "tiktok", label: "TikTok", subtitle: "Hubungkan akun" },
  { value: "youtube", label: "YouTube", subtitle: "Hubungkan akun" },
  { value: "linkedin", label: "LinkedIn", subtitle: "Hubungkan akun" },
];

export function ReplizConnectButtons() {
  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-6">
      {platforms.map((platform) => (
        <Button
          key={platform.value}
          asChild
          variant="outline"
          className="h-auto w-full justify-start rounded-2xl p-4 transition-all hover:-translate-y-0.5 hover:shadow-md"
        >
          <a
            href={`/api/integrations/repliz/authorize?platform=${platform.value}`}
            className="flex flex-col items-start gap-3"
          >
            <div
              className={`flex h-11 w-11 items-center justify-center rounded-xl ${getPlatformTint(platform.value)}`}
            >
              <PlatformIcon platform={platform.value} size={24} />
            </div>
            <div className="flex flex-col items-start gap-0.5">
              <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">
                {platform.label}
              </span>
              <span className="text-xs text-zinc-500 dark:text-zinc-400">
                {platform.subtitle}
              </span>
            </div>
          </a>
        </Button>
      ))}
    </div>
  );
}