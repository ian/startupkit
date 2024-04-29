import { NextResponse } from "next/server";
import { clearSession, getSession } from "./auth/server";
import { getAuthorizationUrl } from "./auth/client";

export async function middleware() {
  const hasVerifiedToken = await getSession();

  // Redirect unauthenticated users to the AuthKit flow
  if (!hasVerifiedToken) {
    const authorizationUrl = await getAuthorizationUrl();
    await clearSession();
    return NextResponse.redirect(authorizationUrl);
  }

  return NextResponse.next();
}

// Match against the account page
export const config = { matcher: ["/account/:path*"] };
