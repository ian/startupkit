import { Pricing } from "@/components/home/pricing";
import { getProducts } from "@startupkit/payments/server";

export default async function PricingPage() {
  const products = await getProducts();
  return <Pricing products={products ?? []} />;
}
