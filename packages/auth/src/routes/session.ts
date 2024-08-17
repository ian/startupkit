import { NextResponse } from "next/server";
import { getSession } from "../server";

export async function handler(request: Request) {
  const session = await getSession();
  return NextResponse.json(session);
}
