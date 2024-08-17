import { getSession } from "@startupkit/auth/server";
import { checkoutWithStripe } from "../server";

export async function handler(request: Request) {
  const body = await request.json();
  const { price, redirectTo } = body;
  const { user } = await getSession();

  if (!user) {
    throw new Error("Authentication required");
  }

  const { status, errorRedirect, sessionId } = await checkoutWithStripe(
    user,
    price,
    {
      successPath: redirectTo,
      errorPath: redirectTo,
    },
  );

  return Response.json(
    {
      status,
      errorRedirect,
      sessionId,
    },
    {
      status: 200,
    },
  );
}
