import Image from "next/image";

export function SidebarLogo() {
  return (
    <div className="border-b border-zinc-200 p-6 dark:border-zinc-800">
      <div className="flex items-center gap-3">
        <Image 
          src="/logo.png" 
          alt="Sahabat Kreator Logo" 
          width={40} 
          height={40}
          className="rounded-lg"
        />
        <div>
          <h1 className="text-lg font-bold text-zinc-900 dark:text-white">
            Sahabat Kreator
          </h1>
          <p className="mt-1 text-sm text-zinc-500 dark:text-zinc-400">
            Learning Platform
          </p>
        </div>
      </div>
    </div>
  );
}