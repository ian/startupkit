import Stripe from "stripe";
import {
  calculateTrialEndUnixTimestamp,
  createOrRetrieveCustomer,
} from "../lib/helpers";
import { getErrorRedirect, getURL } from "../lib/url";
import { type Price, PricingType } from "@prisma/client";
import { stripe } from "../lib/stripe";

type CheckoutResponse = {
  status: "success" | "redirect" | "error";
  sessionId?: string;
  errorRedirect?: string;
};

export async function checkoutWithStripe(
  user: { id: string; email: string },
  price: Price,
  opts: {
    successPath?: string;
    errorPath?: string;
  },
): Promise<CheckoutResponse> {
  const { successPath = "/billing", errorPath = "/billing" } = opts;

  try {
    if (!user) {
      throw new Error("Could not get user session.");
    }

    // Retrieve or create the customer in Stripe
    let customer: string;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user?.id || "",
        email: user?.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    let subscription: Stripe.Subscription | undefined;

    // Retrieve the existing subscription if it exists
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer,
        status: "active",
      });
      if (subscriptions.data.length > 0) {
        subscription = subscriptions.data[0];
      }
    } catch (err) {
      console.error(err);
      throw new Error("Unable to retrieve subscriptions.");
    }

    // Create or update the checkout session based on whether a subscription exists
    if (subscription) {
      let params: Stripe.SubscriptionUpdateParams = {
        items: [
          {
            id: subscription.items.data[0].id,
            price: price.id,
          },
        ],
        proration_behavior: "create_prorations",
        trial_end: calculateTrialEndUnixTimestamp(price.trialPeriodDays),
      };

      try {
        await stripe.subscriptions.update(subscription.id, params);

        return {
          status: "success",
        };
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Unknown error";
        console.error(error);

        return {
          status: "error",
          errorRedirect: getErrorRedirect(
            errorPath,
            errorMessage,
            "Please try again later or contact a system administrator.",
          ),
        };
      }
    } else {
      let params: Stripe.Checkout.SessionCreateParams = {
        allow_promotion_codes: true,
        billing_address_collection: "required",
        customer,
        customer_update: {
          address: "auto",
        },
        line_items: [
          {
            price: price.id,
            quantity: 1,
          },
        ],
        cancel_url: getURL(errorPath),
        success_url: getURL(successPath),
      };

      if (price.type === PricingType.ONE_TIME) {
        // Process one-time payment
        params = {
          ...params,
          mode: "payment",
        };
      } else {
        // Create a new subscription
        params = {
          ...params,
          mode: "subscription",
          subscription_data: {
            trial_end: calculateTrialEndUnixTimestamp(price.trialPeriodDays),
          },
        };
      }

      // Create a checkout session in Stripe
      let session;
      try {
        session = await stripe.checkout.sessions.create(params);
      } catch (err) {
        console.error(err);
        throw new Error("Unable to create checkout session.");
      }

      // Instead of returning a Response, just return the data or error.
      if (session) {
        return { status: "redirect", sessionId: session.id };
      } else {
        throw new Error("Unable to create checkout session.");
      }
    }
  } catch (error) {
    console.log(error);

    if (error instanceof Error) {
      return {
        status: "error",
        errorRedirect: getErrorRedirect(
          errorPath,
          error.message,
          "Please try again later or contact a system administrator.",
        ),
      };
    } else {
      return {
        status: "error",
        errorRedirect: getErrorRedirect(
          errorPath,
          "An unknown error occurred.",
          "Please try again later or contact a system administrator.",
        ),
      };
    }
  }
}
