import { NextRequest, NextResponse } from "next/server";
import { getSession } from "../server";
import { getClient, getClientId } from "../lib/workos";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

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

      const props = {
        wosId: wosUser.id,
        avatarUrl: wosUser.profilePictureUrl,
        email: wosUser.email,
        firstName: wosUser.firstName,
        lastName: wosUser.lastName,
      };

      const user = await prisma.user.upsert({
        where: {
          wosId: wosUser.id,
        },
        create: props,
        update: {},
        select: {
          id: true,
          email: true,
          firstName: true,
          lastName: true,
          avatarUrl: true,
        },
      });

      const session = await getSession();
      session.user = user;
      session.createdAt = new Date().toISOString();
      await session.save();

      const url = request.nextUrl.clone();
      url.searchParams.delete("code");
      url.pathname = "/dash";

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
