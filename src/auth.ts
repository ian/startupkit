import { cookies } from "next/headers";
import WorkOS, { User } from "@workos-inc/node";
import { IronSession, getIronSession } from "iron-session";

export interface SessionData {
  user: User;
  createdAt: string;
}

// Initialize the WorkOS client
export const workos = new WorkOS(process.env.WORKOS_API_KEY);

export function getClientId() {
  const clientId = process.env.WORKOS_CLIENT_ID;

  if (!clientId) {
    throw new Error("WORKOS_CLIENT_ID is not set");
  }

  return clientId;
}

export async function getAuthorizationUrl() {
  const redirectUri = process.env.WORKOS_REDIRECT_URI;

  if (!redirectUri) {
    throw new Error("WORKOS_REDIRECT_URI is not set");
  }

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId: getClientId(),
    // The endpoint that WorkOS will redirect to after a user authenticates
    redirectUri,
  });

  return authorizationUrl;
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
  // redirect("/");
}
