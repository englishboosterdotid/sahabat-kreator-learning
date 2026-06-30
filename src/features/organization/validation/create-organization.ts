import { z } from "zod";

export const createOrganizationSchema = z.object({
  name: z
    .string()
    .trim()
    .min(3, "Minimal 3 karakter")
    .max(100, "Maksimal 100 karakter"),
});

export type CreateOrganizationInput = z.infer<
  typeof createOrganizationSchema
>;