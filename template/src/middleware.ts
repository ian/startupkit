import { NextResponse } from "next/server";

export function middleware() {
  return NextResponse.next();
}

// Match against the account page
export const config = { matcher: ["/account/:path*"] };
