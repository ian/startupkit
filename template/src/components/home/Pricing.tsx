"use client";

import { getStripe } from "@startupkit/payments";

import classNames from "clsx";
import { useRouter, usePathname } from "next/navigation";
import { useState } from "react";
import { Price, Product, Subscription } from "@prisma/client";
import { getErrorRedirect } from "@/lib/url";
import { getAuthorizationUrl, SessionData } from "@startupkit/auth";

interface ProductWithPrices extends Product {
  prices: Price[];
}
interface PriceWithProduct extends Price {
  product: Product | null;
}
interface SubscriptionWithProduct extends Subscription {
  price: PriceWithProduct | null;
}

interface Props {
  user: SessionData["user"] | null | undefined;
  products: ProductWithPrices[];
  subscription: SubscriptionWithProduct | null | undefined;
}

type BillingInterval = "lifetime" | "year" | "month";

export function Pricing({ user, products, subscription }: Props) {
  const router = useRouter();
  const currentPath = usePathname();
  const authorizationUrl = getAuthorizationUrl();

  const [billingInterval, setBillingInterval] =
    useState<BillingInterval>("month");
  const [priceIdLoading, setPriceIdLoading] = useState<string>();

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
      setPriceIdLoading(undefined);
      return router.push(authorizationUrl);
    }

    const { errorRedirect, sessionId } = await fetch("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ price }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .catch(() => setPriceIdLoading(undefined));

    if (errorRedirect) {
      setPriceIdLoading(undefined);
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      setPriceIdLoading(undefined);
      return router.push(
        getErrorRedirect(
          currentPath,
          "An unknown error occurred.",
          "Please try again later or contact a system administrator.",
        ),
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });

    setPriceIdLoading(undefined);
  };

  if (!products.length) {
    return (
      <section className="">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center"></div>
          <p className="text-4xl font-extrabold sm:text-center sm:text-6xl">
            No subscription pricing plans found. Create them in your{" "}
            <a
              className="text-pink-500 underline"
              href="https://dashboard.stripe.com/products"
              rel="noopener noreferrer"
              target="_blank"
            >
              Stripe Dashboard
            </a>
            .
          </p>
        </div>
      </section>
    );
  } else {
    return (
      <section className="">
        <div className="max-w-6xl px-4 py-8 mx-auto sm:py-24 sm:px-6 lg:px-8">
          <div className="sm:flex sm:flex-col sm:align-center">
            <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">
              Pricing Plans
            </h1>
            <p className="max-w-2xl m-auto mt-5 text-xl sm:text-center sm:text-2xl">
              Start building for free, then add a site plan to go live. Account
              plans unlock additional features.
            </p>
            <div className="relative self-center mt-6 bg-zinc-900 rounded-lg p-0.5 flex sm:mt-8 border border-zinc-800">
              {intervals.includes("month") && (
                <button
                  onClick={() => setBillingInterval("month")}
                  type="button"
                  className={`${
                    billingInterval === "month"
                      ? "relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white"
                      : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Monthly
                </button>
              )}
              {intervals.includes("year") && (
                <button
                  onClick={() => setBillingInterval("year")}
                  type="button"
                  className={`${
                    billingInterval === "year"
                      ? "relative w-1/2 bg-zinc-700 border-zinc-800 shadow-sm text-white"
                      : "ml-0.5 relative w-1/2 border border-transparent text-zinc-400"
                  } rounded-md m-1 py-2 text-sm font-medium whitespace-nowrap focus:outline-none focus:ring-2 focus:ring-pink-500 focus:ring-opacity-50 focus:z-10 sm:w-auto sm:px-8`}
                >
                  Yearly (save 30%)
                </button>
              )}
            </div>
          </div>
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
                      "border-pink-500": subscription
                        ? product.name === subscription?.price?.product?.name
                        : product.name === "Freelancer",
                    },
                    "flex-1", // This makes the flex item grow to fill the space
                    "basis-1/3", // Assuming you want each card to take up roughly a third of the container's width
                    "max-w-xs", // Sets a maximum width to the cards to prevent them from getting too large
                  )}
                >
                  <div className="p-6">
                    <h2 className="text-2xl font-semibold leading-6 text-black">
                      {product.name}
                    </h2>
                    <p className="mt-4 text-zinc-500">{product.description}</p>
                    <p className="mt-8">
                      <span className="text-5xl font-extrabold text-black">
                        {priceString}
                      </span>
                      <span className="text-base font-medium text-zinc-100">
                        /{billingInterval}
                      </span>
                    </p>
                    <button
                      type="button"
                      disabled={priceIdLoading === price.id}
                      onClick={() => handleStripeCheckout(price)}
                      className="block w-full py-2 mt-8 text-sm font-semibold text-center text-white rounded-md hover:bg-zinc-900"
                    >
                      {subscription ? "Manage" : "Subscribe"}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    );
  }
}
