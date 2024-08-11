import { getAuthorizationUrl } from "../client";
import { NextResponse } from "next/server";

export async function handler(request: Request) {
  const authorizationUrl = getAuthorizationUrl();
  return NextResponse.redirect(authorizationUrl);
}
