import { createStripePortal } from "@/stripe/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { redirectTo } = body;

  const redirectUrl = await createStripePortal(redirectTo || "/");

  return Response.json(
    {
      redirectUrl,
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
