import WorkOS, { User } from "@workos-inc/node";
import { getURL } from "@startupkit/utils";

const key = process.env.WORKOS_API_KEY;

const clientId =
  process.env.NEXT_PUBLIC_WORKOS_CLIENT_ID || process.env.WORKOS_CLIENT_ID;

const redirectUri =
  process.env.NEXT_PUBLIC_WORKOS_REDIRECT_URI ||
  process.env.WORKOS_REDIRECT_URI;

export const getClient = () => new WorkOS(key!);

export function getClientId(): string {
  return clientId!;
}

export function getRedirectUri(): string {
  return redirectUri || getURL("/api/auth/callback");
}
