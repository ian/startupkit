import { getAuthorizationUrl } from "@startupkit/auth";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  const authorizationUrl = getAuthorizationUrl();
  return NextResponse.redirect(authorizationUrl);
}
