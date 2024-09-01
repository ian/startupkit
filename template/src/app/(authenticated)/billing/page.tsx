import { CustomerPortalButton } from "@/components/app/customer-portal-button";
import { Pricing } from "@/components/app/pricing";
import { SearchParamsError } from "@/components/app/search-params-error";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { getUser } from "@startupkit/auth/server";
import { getProducts, getSubscription } from "@startupkit/payments/server";

export default async function BillingPage() {
	const { user } = await getUser();
	const subscription = await getSubscription(user?.id as string);
	const products = await getProducts();

	return (
		<div className="space-y-20">
			<SearchParamsError />
			{subscription && <CurrentSubscription subscription={subscription} />}
			<Pricing products={products ?? []} />
		</div>
	);
}

const CurrentSubscription = ({
	subscription,
}: {
	subscription: NonNullable<Awaited<ReturnType<typeof getSubscription>>>;
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

			<CardContent className="flex justify-between items-center">
				<p>
					You are currently on the{" "}
					<strong>{subscription.price?.product?.name}</strong> plan for{" "}
					<strong>
						{subscriptionPrice}/{subscription?.price?.interval}
					</strong>
				</p>

				<CustomerPortalButton variant="destructive">
					Cancel Subscription
				</CustomerPortalButton>
			</CardContent>
		</Card>
	);
};
