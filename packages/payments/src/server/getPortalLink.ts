import { getSession } from "@startupkit/auth/server";
import { createOrRetrieveCustomer } from "../lib/helpers";
import { stripe } from "../lib/stripe";
import { getErrorRedirect, getURL } from "../lib/url";

export async function getPortalLink(currentPath: string) {
  try {
    const { user } = await getSession();

    if (!user) {
      throw new Error("Could not get user session.");
    }

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
        return_url: getURL("/account"),
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
        currentPath,
        error.message,
        "Please try again later or contact a system administrator.",
      );
    } else {
      return getErrorRedirect(
        currentPath,
        "An unknown error occurred.",
        "Please try again later or contact a system administrator.",
      );
    }
  }
}
