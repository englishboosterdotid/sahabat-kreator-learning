import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

import { auth } from "@/lib/auth/server";
import { replizPlatformSchema } from "@/features/repliz/validation/repliz";
import { getReplizAuthorizeUrl } from "@/lib/integrations/repliz/client";

export async function GET(request: NextRequest) {
  try {
    const platformValue = request.nextUrl.searchParams.get("platform");
    const parsedPlatform = replizPlatformSchema.safeParse(platformValue);

    if (!parsedPlatform.success) {
      return NextResponse.json(
        { message: "Platform tidak valid" },
        { status: 400 },
      );
    }

    const fullOrg = await (auth as any).api.getFullOrganization({
      headers: await headers(),
    });

    const activeTeam = fullOrg?.activeTeam ?? fullOrg?.teams?.[0] ?? null;

    if (!activeTeam?.id) {
      return NextResponse.json(
        { message: "Tidak ada team aktif" },
        { status: 400 },
      );
    }

    const appUrl = process.env.NEXT_PUBLIC_APP_URL;

    if (!appUrl) {
      return NextResponse.json(
        { message: "NEXT_PUBLIC_APP_URL belum diisi" },
        { status: 500 },
      );
    }

    // Penting: callback TANPA query string
    const redirectUrl = `${appUrl}/api/integrations/repliz/callback`;

    const { url } = await getReplizAuthorizeUrl(
      parsedPlatform.data,
      redirectUrl,
    );

    const response = NextResponse.redirect(url);

    response.cookies.set(
      "repliz_oauth_context",
      JSON.stringify({
        teamId: activeTeam.id,
        platform: parsedPlatform.data,
      }),
      {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 10,
      },
    );

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Gagal memulai OAuth Repliz";

    return NextResponse.json({ message }, { status: 500 });
  }
}