import { z } from "zod";
import {
  replizAccountDetailSchema,
  replizAuthorizeResponseSchema,
  replizConnectResponseSchema,
  replizExchangeResponseSchema,
  replizSelectableResourcesResponseSchema,
  type ReplizPlatform,
  type ReplizSingleStepPlatform,
  type ReplizTwoStepPlatform,
} from "@/features/repliz/validation/repliz";

const REPLIZ_BASE_URL = process.env.REPLIZ_BASE_URL ?? "https://api.repliz.com";

function getBasicAuthHeader() {
  const accessKey = process.env.REPLIZ_ACCESS_KEY;
  const secretKey = process.env.REPLIZ_SECRET_KEY;

  if (!accessKey || !secretKey) {
    throw new Error("REPLIZ_ACCESS_KEY atau REPLIZ_SECRET_KEY belum diisi");
  }

  const encoded = Buffer.from(`${accessKey}:${secretKey}`).toString("base64");
  return `Basic ${encoded}`;
}

async function replizFetch<T>(
  path: string,
  init: RequestInit,
  schema: z.ZodType<T>,
): Promise<T> {
  const headers = new Headers(init.headers);

  headers.set("Authorization", getBasicAuthHeader());

  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${REPLIZ_BASE_URL}${path}`, {
    ...init,
    headers,
    cache: "no-store",
  });

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new Error(
      data?.message ?? `Request ke Repliz gagal (${response.status})`,
    );
  }

  return schema.parse(data);
}

export function isSingleStepPlatform(
  platform: ReplizPlatform,
): platform is ReplizSingleStepPlatform {
  return ["instagram", "threads", "tiktok"].includes(platform);
}

export function isTwoStepPlatform(
  platform: ReplizPlatform,
): platform is ReplizTwoStepPlatform {
  return ["facebook", "youtube", "linkedin"].includes(platform);
}

export async function getReplizAuthorizeUrl(
  platform: ReplizPlatform,
  redirectUrl: string,
) {
  const params = new URLSearchParams({
    redirect: redirectUrl,
  });

  return replizFetch(
    `/public/account/${platform}/authorize?${params.toString()}`,
    { method: "GET" },
    replizAuthorizeResponseSchema,
  );
}

export async function connectSingleStepPlatform(
  platform: ReplizSingleStepPlatform,
  code: string,
) {
  return replizFetch(
    `/public/account/${platform}/connect`,
    {
      method: "POST",
      body: JSON.stringify({ code }),
    },
    replizConnectResponseSchema,
  );
}

export async function exchangeTwoStepToken(
  platform: ReplizTwoStepPlatform,
  code: string,
) {
  return replizFetch(
    `/public/account/${platform}/exchange`,
    {
      method: "POST",
      body: JSON.stringify({ code }),
    },
    replizExchangeResponseSchema,
  );
}

export async function listSelectableResources(
  platform: ReplizTwoStepPlatform,
  token: string,
) {
  const endpoint =
    platform === "facebook"
      ? "/public/account/facebook/page"
      : platform === "youtube"
        ? "/public/account/youtube/channel"
        : "/public/account/linkedin/organization";

  const params = new URLSearchParams({ token });

  return replizFetch(
    `${endpoint}?${params.toString()}`,
    { method: "GET" },
    replizSelectableResourcesResponseSchema,
  );
}

export async function connectTwoStepPlatform(
  platform: ReplizTwoStepPlatform,
  resourceId: string,
  token: string,
  resourceToken?: string,
) {
  const endpoint =
    platform === "facebook"
      ? "/public/account/facebook/connect"
      : platform === "youtube"
        ? "/public/account/youtube/connect"
        : "/public/account/linkedin/connect";

  const body =
    platform === "facebook"
      ? { pageId: resourceId, token: resourceToken ?? token }
      : platform === "youtube"
        ? { channelId: resourceId, token: resourceToken ?? token }
        : { organizationId: resourceId, token: resourceToken ?? token };

  return replizFetch(
    endpoint,
    {
      method: "POST",
      body: JSON.stringify(body),
    },
    replizConnectResponseSchema,
  );
}

export async function getReplizAccountById(accountId: string) {
  return replizFetch(
    `/public/account/${accountId}`,
    { method: "GET" },
    replizAccountDetailSchema,
  );
}

export async function removeReplizAccount(accountId: string) {
  const response = await fetch(`${REPLIZ_BASE_URL}/public/account/${accountId}`, {
    method: "DELETE",
    headers: {
      Authorization: getBasicAuthHeader(),
    },
    cache: "no-store",
  });

  if (!response.ok && response.status !== 204) {
    const text = await response.text();
    const data = text ? JSON.parse(text) : null;

    throw new Error(
      data?.message ?? `Gagal menghapus akun Repliz (${response.status})`,
    );
  }

  return true;
}