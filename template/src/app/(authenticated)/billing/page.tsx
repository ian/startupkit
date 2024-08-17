import { CustomerPortalButton } from "@/components/app/customer-portal";
import { Pricing } from "@/components/home/pricing";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { getUser } from "@startupkit/auth/server";
import { getProducts, getSubscription } from "@startupkit/payments/server";

// Define the type for the subscription
type SubscriptionType = Awaited<ReturnType<typeof getSubscription>>;

export default async function PricingPage() {
  const { user } = await getUser();
  const subscription = await getSubscription(user?.id as string);
  const products = await getProducts();

  return subscription ? (
    <Subscription subscription={subscription} />
  ) : (
    <Pricing products={products ?? []} />
  );
}

const Subscription = ({
  subscription,
}: {
  subscription: NonNullable<SubscriptionType>;
}) => {
  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.price?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.price?.unitAmount || 0) / 100);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Your Subscription</CardTitle>
        <CardDescription>Manage your subscription</CardDescription>
      </CardHeader>

      <CardContent className="space-y-4">
        <p>
          You are currently on the{" "}
          <strong>{subscription.price?.product?.name}</strong> plan for{" "}
          <strong>
            {subscriptionPrice}/{subscription?.price?.interval}
          </strong>
        </p>
        <CustomerPortalButton />
      </CardContent>
    </Card>
  );
};
