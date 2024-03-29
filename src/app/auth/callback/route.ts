import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../../../auth/server";
import { getClientId, workos } from "@/auth/client";
import { prisma } from "prisma/client";

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get("code");

  if (code) {
    try {
      // Use the code returned to us by AuthKit and authenticate the user with WorkOS
      const { user: wosUser } =
        await workos.userManagement.authenticateWithCode({
          clientId: getClientId(),
          code,
        });

      const props = {
        workOSId: wosUser.id,
        avatarUrl: wosUser.profilePictureUrl,
        email: wosUser.email,
        firstName: wosUser.firstName,
        lastName: wosUser.lastName,
      };

      const user = await prisma.user.upsert({
        where: {
          workOSId: wosUser.id,
        },
        create: props,
        update: {},
      });

      const session = await getSession();
      session.user = user;
      session.createdAt = new Date().toISOString();
      await session.save();

      const url = request.nextUrl.clone();
      url.searchParams.delete("code");
      url.pathname = "/";

      return NextResponse.redirect(url);
    } catch (error) {
      const errorRes = {
        error: error instanceof Error ? error.message : String(error),
      };
      console.error(errorRes);
      return NextResponse.redirect(new URL("/error", request.url));
    }
  }

  return NextResponse.redirect(new URL("/error", request.url));
}
