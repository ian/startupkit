"use client";

import { useState } from "react";
import { $Enums, Price } from "@prisma/client";
import { useAuth } from "@startupkit/auth";
import { useCheckout, useSubscription } from "@startupkit/payments";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import { getProducts } from "@startupkit/payments/server";
import { pause } from "@/lib/utils";

type Products = Awaited<ReturnType<typeof getProducts>>;

// TODO: edit these values to match your plan intervals
const intervals = {
  month: "Monthly",
  year: "Yearly (save 30%)",
} as Record<$Enums.PricingPlanInterval, string>;

interface PricingProps {
  className?: string;
  products: Products;
}

export function Pricing({ className, products }: PricingProps) {
  const { user, login } = useAuth();
  const { checkout } = useCheckout();
  const { subscription, refetch } = useSubscription();

  const [billingInterval, setBillingInterval] =
    useState<$Enums.PricingPlanInterval>("month");

  const [priceLoading, setPriceLoading] = useState<string>();

  const handleStripeCheckout = async (price: Price) => {
    setPriceLoading(price.id);

    if (!user) {
      login();
    }

    try {
      await checkout(price);

      // Set 1s pause to wait for the webhook
      await pause(1000);
      await refetch();
      setPriceLoading(undefined);
    } catch (err) {
      console.error(err);
      setPriceLoading(undefined);
    }
  };

  if (!products.length) {
    return <NoProductsFoundError />;
  }

  return (
    <section className={cn(className)}>
      <div className="max-w-6xl">
        <BillingInterval
          selected={billingInterval}
          intervals={intervals}
          onChange={setBillingInterval}
        />
        <div className="flex flex-wrap justify-center gap-6 mt-12 space-y-4 sm:mt-16 sm:space-y-0 lg:max-w-4xl lg:mx-auto xl:max-w-none xl:mx-0">
          {products.map((product) => {
            const price = product?.prices?.find(
              (price) => price.interval === billingInterval,
            );

            if (!price) return null;

            const priceString = new Intl.NumberFormat("en-US", {
              style: "currency",
              currency: price.currency!,
              minimumFractionDigits: 0,
            }).format(((price?.unitAmount as number) || 0) / 100);

            const isCurrent =
              product.name === subscription?.price?.product?.name &&
              subscription?.price.interval === billingInterval;

            return (
              <div
                key={product.id}
                className={cn(
                  isCurrent
                    ? "border-primary bg-primary/20"
                    : "border-gray-100 bg-secondary",
                  "text-black flex flex-col rounded-lg border-4 ",
                  "p-6 justify-between flex-1 max-w-xs relative",
                )}
              >
                {isCurrent ? (
                  <div className="flex justify-center w-full absolute left-0 -top-3">
                    <p className="shrink w-auto bg-primary text-white px-5 py-1 rounded text-xs">
                      Current Plan
                    </p>
                  </div>
                ) : null}

                <div className="basis-1/3">
                  <h2 className="text-2xl font-semibold leading-6 ">
                    {product.name}
                  </h2>
                  <p className="mt-4">{product.description}</p>
                </div>

                <p className="mt-8 basis-1/3">
                  <span className="text-5xl font-extrabold ">
                    {priceString}
                  </span>
                  <span className="text-base font-medium">
                    /{billingInterval}
                  </span>
                </p>

                <Button
                  onClick={() => handleStripeCheckout(price)}
                  className="mt-8 w-full"
                  loading={priceLoading === price.id}
                  disabled={isCurrent}
                >
                  {isCurrent
                    ? "Current Plan"
                    : subscription
                      ? "Switch to Plan"
                      : "Subscribe"}
                </Button>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

const BillingInterval = ({
  intervals,
  onChange,
  selected,
}: {
  intervals: Record<$Enums.PricingPlanInterval, string>;
  onChange: (interval: $Enums.PricingPlanInterval) => void;
  selected: $Enums.PricingPlanInterval;
}) => {
  return (
    <div className="sm:flex sm:flex-col sm:align-center">
      <div className="relative self-center bg-gray-100 rounded-lg flex">
        {Object.entries(intervals).map(([val, label]) => (
          <button
            key={val}
            onClick={() => onChange(val as $Enums.PricingPlanInterval)}
            type="button"
            className={`${
              selected === val
                ? "relative w-1/2 bg-primary text-white"
                : "ml-0.5 relative w-1/2"
            } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:z-10 sm:w-auto sm:px-8`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

const NoProductsFoundError = () => {
  return (
    <Dialog open>
      <DialogContent closeable={false}>
        <DialogHeader>
          <DialogTitle className="mb-5">No Stripe Products Found</DialogTitle>
          <DialogDescription className="text-left">
            Create them in your{" "}
            <a
              className="text-black underline font-medium"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>{" "}
            or generate them via fixtures by running{" "}
            <code className="whitespace-nowrap bg-gray-100 px-1 py-0.5">
              pnpm stripe:fixtures
            </code>
          </DialogDescription>
          <DialogDescription className="text-left">
            For more infromation, see the StartupKit payment docs at{" "}
            <a
              className="text-black underline font-medium"
              href="https://startupkit.com/docs/payments"
              rel="noopener noreferrer"
              target="_blank"
            >
              https://startupkit.com/docs/payments
            </a>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};
