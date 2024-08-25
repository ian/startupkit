import { NextRequest, NextResponse } from "next/server";
import { getSession, SessionUser } from "../server";
import { getClient, getClientId } from "../lib/workos";
import { getURL } from "@startupkit/utils";

export async function handler(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      // Use the code returned to us by AuthKit and authenticate the user with WorkOS
      const { user: wosUser } =
        await getClient().userManagement.authenticateWithCode({
          clientId: getClientId(),
          code,
        });

      const user: SessionUser = {
        id: wosUser.id,
        email: wosUser.email,
        firstName: wosUser.firstName,
        lastName: wosUser.lastName,
        avatarUrl: wosUser.profilePictureUrl,
      };

      const session = await getSession();
      session.user = user;
      session.createdAt = new Date().toISOString();

      await session.save();

      const url = getURL("/dash");

      return NextResponse.redirect(url);
    } catch (error) {
      const errorRes = {
        error: error instanceof Error ? error.message : String(error),
      };
      console.error(errorRes);
      return NextResponse.redirect(getURL("/error"));
    }
  }

  return NextResponse.redirect(getURL("/error"));
}
