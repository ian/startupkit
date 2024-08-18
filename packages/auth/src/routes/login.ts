import { getClient, getClientId } from "../lib/workos";
import { NextResponse } from "next/server";

/**
 * @deprecated - use useAuth()
 * @param request
 * @returns
 */
export async function handler(request: Request) {
  const redirectUri = process.env.WORKOS_REDIRECT_URI!;
  const authorizationUrl = getClient().userManagement.getAuthorizationUrl({
    provider: "authkit",
    clientId: getClientId(),
    redirectUri,
  });
  return NextResponse.redirect(authorizationUrl);
}
