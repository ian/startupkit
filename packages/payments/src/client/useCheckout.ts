import { getErrorRedirect } from "../lib/url";
import { useRouter } from "next/navigation";
import { getStripe } from "./get-stripe";
import { Price } from "@prisma/client";

export const useCheckout = ({ redirectTo }: { redirectTo?: string }) => {
  const router = useRouter();

  const checkout = async (
    price: Price,
    opts: { redirectTo?: string } = {
      redirectTo,
    },
  ) => {
    const { errorRedirect, sessionId } = await fetch("/api/payments/checkout", {
      method: "POST",
      body: JSON.stringify({ price, ...opts }),
      headers: {
        "Content-Type": "application/json",
      },
    }).then((res) => res.json());

    if (errorRedirect) {
      return router.push(errorRedirect);
    }

    if (!sessionId) {
      return router.push(
        getErrorRedirect(
          redirectTo || "/billing",
          "An unknown error occurred.",
          "Please try again later or contact a system administrator.",
        ),
      );
    }

    const stripe = await getStripe();
    stripe?.redirectToCheckout({ sessionId });
  };

  return { checkout };
};
