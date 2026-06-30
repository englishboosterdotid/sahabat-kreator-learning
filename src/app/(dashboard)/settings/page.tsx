"use client";

import { useState } from "react";
import { authClient } from "@/lib/auth/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function SettingsPage() {
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Dummy data untuk sekarang
  const dummyOrg = {
    name: "My Organization",
    slug: "my-organization",
    createdAt: new Date().toISOString(),
  };

  // Initialize form with dummy data
  useState(() => {
    setName(dummyOrg.name);
    setSlug(dummyOrg.slug);
  });

  return (
    <div className="p-6 max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">Pengaturan Organisasi</h1>

      <div className="bg-white dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 p-6">
        <div className="space-y-6">
          <div>
            <Label htmlFor="name">Nama Organisasi</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Masukkan nama organisasi"
              className="mt-2"
            />
          </div>

          <div>
            <Label htmlFor="slug">Slug Organisasi</Label>
            <Input
              id="slug"
              value={slug}
              onChange={(e) => setSlug(e.target.value)}
              placeholder="Masukkan slug organisasi"
              className="mt-2"
            />
            <p className="text-xs text-zinc-500 mt-2">
              Slug digunakan untuk URL unik organisasi Anda
            </p>
          </div>

          <Button disabled={isLoading}>
            {isLoading ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </div>
    </div>
  );
}
