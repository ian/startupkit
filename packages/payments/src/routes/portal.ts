import { createStripePortal } from "../server";

export async function handler(req: Request) {
  const body = await req.json();
  const { redirectTo } = body;

  const redirectUrl = await createStripePortal(redirectTo || "/subscription");

  return Response.json(
    {
      redirectUrl,
    },
    {
      status: 200,
    },
  );
}
