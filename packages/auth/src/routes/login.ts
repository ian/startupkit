import { getAuthorizationUrl } from "../client";
import { NextResponse } from "next/server";

export async function handler(request: Request) {
  const authorizationUrl = getAuthorizationUrl();
  console.log({ authorizationUrl });
  return NextResponse.redirect(authorizationUrl);
}
