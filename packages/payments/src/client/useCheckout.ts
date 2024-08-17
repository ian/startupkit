import { getErrorRedirect } from "../lib/url";
import { useRouter } from "next/navigation";
import { getStripe } from "./get-stripe";
import { Price } from "@prisma/client";

export const useCheckout = ({ redirectTo }: { redirectTo?: string } = {}) => {
  const router = useRouter();

  const checkout = async (
    price: Price,
    opts: { redirectTo?: string } = {
      redirectTo,
    },
  ) => {
    const { status, errorRedirect, sessionId } = await fetch(
      "/api/payments/checkout",
      {
        method: "POST",
        body: JSON.stringify({ price, ...opts }),
        headers: {
          "Content-Type": "application/json",
        },
      },
    ).then((res) => res.json());

    if (status === "error") {
      router.push(errorRedirect);
    }

    if (status === "redirect" && sessionId) {
      const stripe = await getStripe();
      stripe?.redirectToCheckout({ sessionId });
    }

    return { status };
  };

  return { checkout };
};
