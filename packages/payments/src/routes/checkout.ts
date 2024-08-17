import { getSession } from "@startupkit/auth/server";
import { checkoutWithStripe } from "../server";

export async function handler(request: Request) {
  const body = await request.json();
  const { price, redirectTo } = body;
  const { user } = await getSession();

  if (!user) {
    throw new Error("Authentication required");
  }

  const { errorRedirect, sessionId } = await checkoutWithStripe(user, price, {
    // TODO: redirect to the right path
    successPath: redirectTo,
    errorPath: redirectTo,
  });

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
