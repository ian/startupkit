import { checkoutWithStripe } from "../server";

export async function handler(request: Request) {
  const body = await request.json();
  const { price, redirectTo } = body;

  const { errorRedirect, sessionId } = await checkoutWithStripe(
    price,
    redirectTo || "/",
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
