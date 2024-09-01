import { NextResponse } from "next/server"
import { clearSession, getSession } from "@startupkit/auth/server"
// import { getAuthorizationUrl } from "@startupkit/auth";

export async function middleware() {
  // const hasVerifiedToken = await getSession();

  // // Redirect unauthenticated users to the AuthKit flow
  // if (!hasVerifiedToken) {
  //   const authorizationUrl = await getAuthorizationUrl();
  //   await clearSession();
  //   return NextResponse.redirect(authorizationUrl);
  // }

  return NextResponse.next()
}

// Match against the account page
export const config = { matcher: ["/account/:path*"] }
