import WorkOS, { User } from "@workos-inc/node";

export interface SessionData {
  user: User;
  createdAt: string;
}

export const workos = new WorkOS(process.env.WORKOS_API_KEY!);

export function getClientId(): string {
  return process.env.WORKOS_CLIENT_ID!;
}

export function getAuthorizationUrl(): string {
  const redirectUri = process.env.WORKOS_REDIRECT_URI!;

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId: getClientId(),
    redirectUri,
  });

  return authorizationUrl;
}
