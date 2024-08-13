import { getPortalLink } from "../server/getPortalLink";

export async function handler(req: Request) {
  const body = await req.json();
  const { redirectTo } = body;

  const redirectUrl = await getPortalLink(redirectTo || "/subscription");

  return Response.json(
    {
      redirectUrl,
    },
    {
      status: 200,
    },
  );
}
