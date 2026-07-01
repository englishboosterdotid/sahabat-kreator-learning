import { z } from "zod";

export const replizPlatformSchema = z.enum([
  "facebook",
  "instagram",
  "threads",
  "tiktok",
  "youtube",
  "linkedin",
]);

export type ReplizPlatform = z.infer<typeof replizPlatformSchema>;

export const replizSingleStepPlatformSchema = z.enum([
  "instagram",
  "threads",
  "tiktok",
]);

export type ReplizSingleStepPlatform = z.infer<
  typeof replizSingleStepPlatformSchema
>;

export const replizTwoStepPlatformSchema = z.enum([
  "facebook",
  "youtube",
  "linkedin",
]);

export type ReplizTwoStepPlatform = z.infer<
  typeof replizTwoStepPlatformSchema
>;

export const replizAuthorizeResponseSchema = z.object({
  url: z.string().url(),
});

export const replizExchangeResponseSchema = z.object({
  token: z.string().min(1),
});

export const replizConnectResponseSchema = z.object({
  accountId: z.string().min(1),
});

export const replizSelectableResourceSchema = z.object({
  id: z.string(),
  name: z.string(),
  username: z.string().nullable().optional(),
  picture: z.string().nullable().optional(),
  token: z.string().optional(),
});

export const replizSelectableResourcesResponseSchema = z.object({
  docs: z.array(replizSelectableResourceSchema),
});

export const replizAccountDetailSchema = z.object({
  _id: z.string().optional(),
  id: z.string().optional(),
  name: z.string(),
  username: z.string().nullable().optional(),
  picture: z.string().nullable().optional(),
  isConnected: z.boolean().optional(),
  type: z.string(),
});

export const replizPendingCookieSchema = z.object({
  teamId: z.string().min(1),
  platform: replizTwoStepPlatformSchema,
  token: z.string().min(1),
});

export type ReplizSelectableResource = z.infer<
  typeof replizSelectableResourceSchema
>;

export const replizOauthContextSchema = z.object({
  teamId: z.string().min(1),
  platform: replizPlatformSchema,
});

export type ReplizOauthContext = z.infer<typeof replizOauthContextSchema>;