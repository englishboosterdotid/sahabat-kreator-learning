import { z } from "zod";

export const createTeamSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, "Nama brand minimal 2 karakter")
    .max(100, "Nama brand maksimal 100 karakter"),
  slug: z
    .string()
    .trim()
    .min(2, "Slug brand minimal 2 karakter")
    .max(100, "Slug brand maksimal 100 karakter")
    .regex(/^[a-z0-9-]+$/, "Slug hanya boleh berisi huruf kecil, angka, dan tanda hubung"),
  logo: z.string().optional(),
  metadata: z.any().optional(),
});

export type CreateTeamInput = z.infer<typeof createTeamSchema>;
