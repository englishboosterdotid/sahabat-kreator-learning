import { cookies } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import {
  replizOauthContextSchema,
  type ReplizPlatform,
} from "@/features/repliz/validation/repliz";
import {
  connectSingleStepPlatform,
  exchangeTwoStepToken,
  getReplizAccountById,
  isSingleStepPlatform,
  isTwoStepPlatform,
} from "@/lib/integrations/repliz/client";
import { saveReplizConnection } from "@/features/repliz/application/services/repliz-connection-service";

async function persistConnectedAccount(
  teamId: string,
  platform: ReplizPlatform,
  accountId: string,
) {
  const account = await getReplizAccountById(accountId);

  await saveReplizConnection({
    teamId,
    platform,
    replizAccountId: account.id ?? account._id ?? accountId,
    externalName: account.name,
    externalUsername: account.username ?? null,
    externalPicture: account.picture ?? null,
    isConnected: account.isConnected ?? true,
  });
}

export async function GET(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

  try {
    const code = request.nextUrl.searchParams.get("code");
    const cookieStore = await cookies();
    const oauthContextRaw = cookieStore.get("repliz_oauth_context")?.value;

    if (!oauthContextRaw) {
      return NextResponse.redirect(
        `${appUrl}/accounts?replizError=oauth_context_tidak_ada`,
      );
    }

    const oauthContext = replizOauthContextSchema.parse(
      JSON.parse(oauthContextRaw),
    );

    const { platform, teamId } = oauthContext;

    if (!code) {
      return NextResponse.redirect(
        `${appUrl}/accounts?replizError=code_tidak_ada`,
      );
    }

    if (isSingleStepPlatform(platform)) {
      const connectResult = await connectSingleStepPlatform(platform, code);

      await persistConnectedAccount(teamId, platform, connectResult.accountId);

      const response = NextResponse.redirect(
        `${appUrl}/accounts?replizConnected=1&platform=${platform}`,
      );

      response.cookies.delete("repliz_oauth_context");
      return response;
    }

    if (isTwoStepPlatform(platform)) {
      const exchangeResult = await exchangeTwoStepToken(platform, code);

      const response = NextResponse.redirect(
        `${appUrl}/accounts?replizSelect=${platform}`,
      );

      response.cookies.set(
        "repliz_pending_connect",
        JSON.stringify({
          teamId,
          platform,
          token: exchangeResult.token,
        }),
        {
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 10,
        },
      );

      response.cookies.delete("repliz_oauth_context");
      return response;
    }

    return NextResponse.redirect(
      `${appUrl}/accounts?replizError=platform_tidak_didukung`,
    );
  } catch (error) {
    const message =
      error instanceof Error ? encodeURIComponent(error.message) : "unknown_error";

    return NextResponse.redirect(
      `${appUrl}/accounts?replizError=${message}`,
    );
  }
  
}