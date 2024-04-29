import { checkoutWithStripe } from "@/stripe/server";

export async function POST(req: Request) {
  const body = await req.json();
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

export async function OPTIONS(req: Request) {
  return new Response(`Method ${req.method} Not Allowed`, {
    status: 405,
    headers: { Allow: "POST" },
  });
}
