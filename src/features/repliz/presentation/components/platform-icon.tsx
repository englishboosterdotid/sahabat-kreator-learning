import {
  FacebookLogoIcon,
  InstagramLogoIcon,
  ThreadsLogoIcon,
  TiktokLogoIcon,
  YoutubeLogoIcon,
  LinkedinLogoIcon,
} from "@phosphor-icons/react/ssr";

import { cn } from "@/lib/utils";

export type SocialPlatform =
  | "facebook"
  | "instagram"
  | "threads"
  | "tiktok"
  | "youtube"
  | "linkedin";

type PlatformIconProps = {
  platform: SocialPlatform;
  size?: number;
  className?: string;
  weight?: "thin" | "light" | "regular" | "bold" | "fill" | "duotone";
};

const platformIconMap = {
  facebook: FacebookLogoIcon,
  instagram: InstagramLogoIcon,
  threads: ThreadsLogoIcon,
  tiktok: TiktokLogoIcon,
  youtube: YoutubeLogoIcon,
  linkedin: LinkedinLogoIcon,
} as const;

const platformTint: Record<SocialPlatform, string> = {
  facebook:
    "bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
  instagram:
    "bg-pink-100 text-pink-600 dark:bg-pink-900/30 dark:text-pink-400",
  threads:
    "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  tiktok:
    "bg-zinc-100 text-zinc-900 dark:bg-zinc-800 dark:text-zinc-100",
  youtube:
    "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400",
  linkedin:
    "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400",
};

export function getPlatformTint(platform: SocialPlatform): string {
  return platformTint[platform];
}

export function PlatformIcon({
  platform,
  size = 18,
  className,
  weight = "regular",
}: PlatformIconProps) {
  const IconComponent = platformIconMap[platform];

  return (
    <IconComponent
      size={size}
      weight={weight}
      className={cn(className)}
      aria-hidden="true"
    />
  );
}