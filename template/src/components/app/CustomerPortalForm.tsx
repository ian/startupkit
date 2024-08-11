"use client";

import { Button } from "@/ui/button";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import Link from "next/link";
import { Card } from "@/ui/card";
import { Price, Product, Subscription } from "@prisma/client";

type SubscriptionWithPriceAndProduct = Subscription & {
  price:
    | (Price & {
        product: Product | null;
      })
    | null;
};

interface Props {
  subscription: SubscriptionWithPriceAndProduct | null;
}

export function CustomerPortalForm({ subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const [isSubmitting, setSubmitting] = useState(false);

  const subscriptionPrice =
    subscription &&
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: subscription?.price?.currency!,
      minimumFractionDigits: 0,
    }).format((subscription?.price?.unitAmount || 0) / 100);

  const handleStripePortalRequest = async () => {
    setSubmitting(true);

    const { redirectUrl } = await fetch("/api/payments/portal", {
      method: "POST",
      body: JSON.stringify({ redirectTo: currentPath }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    setSubmitting(false);
    return router.push(redirectUrl);
  };

  const footer = subscription ? (
    <div className="flex flex-col items-start justify-between sm:flex-row sm:items-center">
      <p className="pb-4 sm:pb-0">Manage your subscription on Stripe.</p>
      <Button onClick={handleStripePortalRequest} loading={isSubmitting}>
        Open customer portal
      </Button>
    </div>
  ) : null;

  return (
    <Card
      title="Your Plan"
      description={
        subscription
          ? `You are currently on the ${subscription?.price?.product?.name} plan.`
          : "You are not currently subscribed to any plan."
      }
      footer={footer}
    >
      <div className="mt-8 mb-4 text-xl font-semibold">
        {subscription ? (
          `${subscriptionPrice}/${subscription?.price?.interval}`
        ) : (
          <Link href="/checkout">Choose your plan</Link>
        )}
      </div>
    </Card>
  );
}
