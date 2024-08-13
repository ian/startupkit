import { getSession } from "@startupkit/auth/server";
import { checkoutWithStripe } from "../server";

export async function handler(request: Request) {
  const body = await request.json();
  const { price, redirectTo } = body;
  const { user } = await getSession();

  const { errorRedirect, sessionId } = await checkoutWithStripe(
    user,
    price,
    redirectTo || "/subscription",
  );

  return Response.json(
    {
      errorRedirect,
      sessionId,
    },
    {
      status: 200,
    },
  );
}
