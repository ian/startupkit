import { getSession } from "@startupkit/auth/server";
import { Pricing } from "@/components/home/pricing";
import { getProducts, getSubscription } from "@startupkit/payments/server";

export default async function PricingPage() {
  const { user } = await getSession();
  const subscription = await getSubscription(user.id);
  const products = await getProducts();

  return (
    <Pricing
      products={products ?? []}
      subscription={subscription}
      user={user}
    />
  );
}
