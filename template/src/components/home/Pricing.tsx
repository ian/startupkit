"use client";

import classNames from "clsx";
import { useState } from "react";
import { $Enums, Price, Product, Subscription } from "@prisma/client";
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

interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  product: Product | null;
}

interface Props {
  products: ProductWithPrices[];
}

export function Pricing({ products }: Props) {
  const { user, login } = useAuth();
  const { checkout } = useCheckout();
  const { subscription } = useSubscription();

  const [billingInterval, setBillingInterval] =
    useState<$Enums.PricingPlanInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

  console.log({ subscription });

  const intervals = Array.from(
    new Set(
      products.flatMap((product) =>
        product?.prices?.map((price) => price?.interval),
      ),
    ),
  );

  const handleStripeCheckout = async (price: Price) => {
    setPriceIdLoading(price.id);

    if (!user) {
      login();
    }

    try {
      await checkout(price);
    } catch (err) {
      console.error(err);
    } finally {
      setPriceIdLoading(undefined);
    }
  };

  if (!products.length) {
    return <NoProductsFoundError />;
  }

  return (
    <section className="">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 lg:px-8">
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

            return (
              <div
                key={product.id}
                className={classNames(
                  "border-4 flex flex-col rounded-lg shadow-sm divide-y divide-zinc-600 bg-zinc-100",
                  {
                    "border-primary": subscription
                      ? product.name === subscription?.price?.product?.name
                      : product.name === "Freelancer",
                  },
                  "p-6 justify-between flex-1  max-w-xs",
                )}
              >
                <div className="basis-1/3">
                  <h2 className="text-2xl font-semibold leading-6 text-black">
                    {product.name}
                  </h2>
                  <p className="mt-4 text-zinc-500">{product.description}</p>
                </div>

                <p className="mt-8 basis-1/3">
                  <span className="text-5xl font-extrabold text-black">
                    {priceString}
                  </span>
                  <span className="text-base font-medium text-zinc-100">
                    /{billingInterval}
                  </span>
                </p>

                <Button
                  // disabled={priceIdLoading === price.id}
                  onClick={() => handleStripeCheckout(price)}
                  // className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                  className="mt-8 w-full"
                >
                  {subscription ? "Manage" : "Subscribe"}
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
  intervals: $Enums.PricingPlanInterval[];
  onChange: (interval: $Enums.PricingPlanInterval) => void;
  selected: $Enums.PricingPlanInterval;
}) => {
  return (
    <div className="sm:flex sm:flex-col sm:align-center">
      <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
        {intervals.includes("month") && (
          <button
            onClick={() => onChange("month")}
            type="button"
            className={`${
              selected === "month"
                ? "relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white"
                : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
            } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
          >
            Monthly
          </button>
        )}
        {intervals.includes("year") && (
          <button
            onClick={() => onChange("year")}
            type="button"
            className={`${
              selected === "year"
                ? "relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white"
                : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
            } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
          >
            Yearly (save 30%)
          </button>
        )}
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
