import WorkOS, { User } from "@workos-inc/node";

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

export function getAuthorizationUrl() {
  const redirectUri = process.env.WORKOS_REDIRECT_URI;

  if (!redirectUri) {
    throw new Error("WORKOS_REDIRECT_URI is not set");
  }

  const authorizationUrl = workos.userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId: getClientId(),
    redirectUri,
  });

  return authorizationUrl;
}
