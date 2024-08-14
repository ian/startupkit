import { cookies } from "next/headers";
import { IronSession, getIronSession } from "iron-session";
import { type User } from "@prisma/client";

export interface SessionData {
  user: User;
  createdAt: string;
}

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), {
    password: process.env.AUTH_SECRET!,
    cookieName: "_a",
  });
}

export async function getUser(): Promise<{
  isAuthenticated: boolean;
  user?: User | null;
}> {
  const session = await getSession();

  if (session.user) {
    return {
      isAuthenticated: true,
      user: session.user,
    };
  }

  return { isAuthenticated: false };
}

export async function clearSession() {
  const session = await getSession();
  session?.destroy();
}
