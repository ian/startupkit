import { NextResponse } from "next/server";
import { getSession } from "../server";

export async function handler(request: Request) {
  const session = await getSession();
  session.destroy();

  return NextResponse.json(
    {
      message: "Please enter title",
    },
    {
      status: 400,
    },
  );
}
