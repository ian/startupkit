import { createOrRetrieveCustomer } from "../lib/helpers";
import { stripe } from "../lib/stripe";
import { getErrorRedirect, getURL } from "@startupkit/utils";

export async function getPortalLink(
  user: { id: string; email: string },
  opts: {
    successPath?: string;
    errorPath?: string;
  },
) {
  const { successPath = "/billing", errorPath = "/billing" } = opts;
  try {
    let customer;
    try {
      customer = await createOrRetrieveCustomer({
        uuid: user.id || "",
        email: user.email || "",
      });
    } catch (err) {
      console.error(err);
      throw new Error("Unable to access customer record.");
    }

    if (!customer) {
      throw new Error("Could not get customer.");
    }

    try {
      const { url } = await stripe.billingPortal.sessions.create({
        customer,
        return_url: getURL(successPath),
      });
      if (!url) {
        throw new Error("Could not create billing portal");
      }
      return url;
    } catch (err) {
      console.error(err);
      throw new Error("Could not create billing portal");
    }
  } catch (error) {
    if (error instanceof Error) {
      console.error(error);
      return getErrorRedirect(
        errorPath,
        error.message,
        "Please try again later or contact a system administrator.",
      );
    } else {
      return getErrorRedirect(
        errorPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator.",
      );
    }
  }
}
