import { getSession } from "@startupkit/auth/server";
import { getPortalLink } from "../server/getPortalLink";

export async function handler(req: Request) {
  const body = await req.json();
  const { redirectTo } = body;
  const { user } = await getSession();

  if (!user) {
    throw new Error("Authentication required");
  }

  const redirectUrl = await getPortalLink(user, {
    successPath: redirectTo || "/billing",
    errorPath: redirectTo || "/billing",
  });

  return Response.json(
    {
      redirectUrl,
    },
    {
      status: 200,
    },
  );
}
