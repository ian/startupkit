import { getErrorRedirect } from "../lib/url";
import { usePathname, useRouter } from "next/navigation";
import { getStripe } from "./get-stripe";
import { Price } from "@prisma/client";

export const useSubscription = () => {
  const router = useRouter();
  const currentPath = usePathname();

  const checkout = async (
    price: Price,
    opts: { redirectTo?: string } = {
      redirectTo: currentPath,
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
          currentPath,
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
