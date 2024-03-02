/**
 * This is a singleton to ensure we only instantiate Stripe once.
 */
import { Stripe, loadStripe } from "@stripe/stripe-js";

let stripePromise: Promise<Stripe | null>;

export function getStripe(): Promise<Stripe | null> {
  if (!stripePromise)
    stripePromise = loadStripe(process.env.STRIPE_PUBLISHABLE_KEY as string);

  return stripePromise;
}
