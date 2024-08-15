import { getSession } from "@startupkit/auth/server";
import { getSubscription } from "../server";

export async function handler(request: Request) {
  const { user } = await getSession();
  const subscription = await getSubscription(user.id);

  return Response.json(subscription, {
    status: 200,
  });
}
