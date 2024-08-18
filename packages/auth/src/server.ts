import { cookies } from "next/headers";
import { IronSession, getIronSession } from "iron-session";
import { type SessionData, type SessionUser } from "./types";

export * from "./types";

export async function getSession(): Promise<IronSession<SessionData>> {
  return getIronSession<SessionData>(cookies(), {
    password: process.env.AUTH_SECRET!,
    cookieName: "_auth",
  });
}

export async function getUser(): Promise<{
  isAuthenticated: boolean;
  user: SessionUser | null;
}> {
  const session = await getSession();

  if (session.user) {
    return {
      isAuthenticated: true,
      user: session.user,
    };
  }

  return { user: null, isAuthenticated: false };
}

export async function clearSession() {
  const session = await getSession();
  session?.destroy();
}
