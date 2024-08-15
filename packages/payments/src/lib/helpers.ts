import { TRIAL_PERIOD_DAYS } from "./config";
import { stripe } from "./stripe";
import Stripe from "stripe";

import { PricingType, PrismaClient } from "@prisma/client";

export const prisma = new PrismaClient();

const upsertProductRecord = async (product: Stripe.Product) => {
  const productData = {
    id: product.id,
    active: product.active,
    name: product.name,
    description: product.description ?? null,
    image: product.images?.[0] ?? null,
    metadata: product.metadata,
  };

  await prisma.product
    .upsert({
      where: { id: product.id },
      create: productData,
      update: productData,
    })
    .then(() => {
      console.log(`Product inserted/updated: ${product.id}`);
    })
    .catch((upsertError) => {
      if (upsertError)
        throw new Error(`Product insert/update failed: ${upsertError.message}`);
    });
};

const upsertPriceRecord = async (
  price: Stripe.Price,
  retryCount = 0,
  maxRetries = 3,
) => {
  const priceData = {
    id: price.id,
    productId: typeof price.product === "string" ? price.product : "",
    active: price.active,
    currency: price.currency,
    type: price.type.toUpperCase() as PricingType,
    unitAmount: price.unit_amount ?? 0,
    interval: price.recurring?.interval ?? "month",
    intervalCount: price.recurring?.interval_count ?? 0,
    trialPeriodDays: price.recurring?.trial_period_days ?? TRIAL_PERIOD_DAYS,
  };

  await prisma.price
    .upsert({
      where: { id: price.id },
      create: priceData,
      update: priceData,
    })
    .then(() => {
      console.log(`Price inserted/updated: ${price.id}`);
    })
    .catch(async (upsertError) => {
      if (upsertError?.message.includes("foreign key constraint")) {
        if (retryCount < maxRetries) {
          console.log(
            `Retry attempt ${retryCount + 1} for price ID: ${price.id}`,
          );
          await new Promise((resolve) => setTimeout(resolve, 2000));
          await upsertPriceRecord(price, retryCount + 1, maxRetries);
        } else {
          throw new Error(
            `Price insert/update failed after ${maxRetries} retries: ${upsertError.message}`,
          );
        }
      } else {
        throw new Error(`Price insert/update failed: ${upsertError.message}`);
      }
    });
};

const deleteProductRecord = async (product: Stripe.Product) => {
  await prisma.product
    .delete({ where: { id: product.id } })
    .then(() => {
      console.log(`Product deleted: ${product.id}`);
    })
    .catch((deletionError) => {
      throw new Error(`Product deletion failed: ${deletionError.message}`);
    });
};

const deletePriceRecord = async (price: Stripe.Price) => {
  return await prisma.price
    .delete({ where: { id: price.id } })
    .catch((deletionError) => {
      throw new Error(`Price deletion failed: ${deletionError.message}`);
    });
};

const upsertCustomer = async (id: string, customerId: string) => {
  return await prisma.customer
    .upsert({
      where: { id },
      create: { id, stripeCustomerId: customerId },
      update: { stripeCustomerId: customerId },
    })
    .catch((upsertError) => {
      throw new Error(
        `Supabase customer record creation failed: ${upsertError.message}`,
      );
    });
};

const createCustomerInStripe = async (uuid: string, email: string) => {
  const customerData = { metadata: { supabaseUUID: uuid }, email: email };
  const newCustomer = await stripe.customers.create(customerData);
  if (!newCustomer) throw new Error("Stripe customer creation failed.");
  return newCustomer.id;
};

export const calculateTrialEndUnixTimestamp = (
  trialPeriodDays: number | null | undefined,
) => {
  // Check if trialPeriodDays is null, undefined, or less than 2 days
  if (
    trialPeriodDays === null ||
    trialPeriodDays === undefined ||
    trialPeriodDays < 2
  ) {
    return undefined;
  }

  const currentDate = new Date(); // Current date and time
  const trialEnd = new Date(
    currentDate.getTime() + (trialPeriodDays + 1) * 24 * 60 * 60 * 1000,
  ); // Add trial days
  return Math.floor(trialEnd.getTime() / 1000); // Convert to Unix timestamp in seconds
};

const createOrRetrieveCustomer = async ({
  email,
  uuid,
}: {
  email: string;
  uuid: string;
}) => {
  // Check if the customer already exists in Supabase
  const existingCustomer = await prisma.customer.findUnique({
    where: { id: uuid },
  });

  // Retrieve the Stripe customer ID using the Supabase customer ID, with email fallback
  let stripeCustomerId: string | undefined;
  if (existingCustomer?.stripeCustomerId) {
    const existingStripeCustomer = await stripe.customers.retrieve(
      existingCustomer.stripeCustomerId,
    );
    stripeCustomerId = existingStripeCustomer.id;
  } else {
    // If Stripe ID is missing from Supabase, try to retrieve Stripe customer ID by email
    const stripeCustomers = await stripe.customers.list({ email: email });
    stripeCustomerId =
      stripeCustomers.data.length > 0 ? stripeCustomers.data[0].id : undefined;
  }

  // If still no stripeCustomerId, create a new customer in Stripe
  const stripeIdToInsert = stripeCustomerId
    ? stripeCustomerId
    : await createCustomerInStripe(uuid, email);

  if (!stripeIdToInsert) throw new Error("Stripe customer creation failed.");

  if (existingCustomer && stripeCustomerId) {
    if (existingCustomer.stripeCustomerId !== stripeCustomerId) {
      await prisma.customer
        .update({
          where: { id: uuid },
          data: { stripeCustomerId: stripeCustomerId },
        })
        .then(() => {
          console.warn(
            `Supabase customer record mismatched Stripe ID. Supabase record updated.`,
          );
        })
        .catch((updateError) => {
          throw new Error(
            `Supabase customer record update failed: ${updateError.message}`,
          );
        });
    }
    // If Supabase has a record and matches Stripe, return Stripe customer ID
    return stripeCustomerId;
  } else {
    console.error(
      `Supabase customer record was missing. A new record was created.`,
    );

    // If Supabase has no record, create a new record and return Stripe customer ID
    const upsertedStripeCustomer = await upsertCustomer(uuid, stripeIdToInsert);
    if (!upsertedStripeCustomer)
      throw new Error("Supabase customer record creation failed.");

    return stripeIdToInsert;
  }
};

/**
 * Copies the billing details from the payment method to the customer object.
 */
const copyBillingDetailsToCustomer = async (
  uuid: string,
  payment_method: Stripe.PaymentMethod,
) => {
  //Todo: check this assertion
  const customer = payment_method.customer as string;
  const { name, phone, address } = payment_method.billing_details;
  if (!name || !phone || !address) return;
  //@ts-ignore
  await stripe.customers.update(customer, { name, phone, address });
  await prisma.user
    .update({
      where: { id: uuid },
      data: {
        billingAddress: { ...address },
        paymentMethod: { ...payment_method[payment_method.type] } as object,
      },
    })
    .catch((updateError) => {
      throw new Error(`Customer update failed: ${updateError.message}`);
    });
};

const manageSubscriptionStatusChange = async (
  subscriptionId: string,
  customerId: string,
  createAction = false,
) => {
  // Get customer's UUID from mapping table.
  const customerData = await prisma.customer.findFirst({
    where: {
      stripeCustomerId: customerId,
    },
    select: {
      id: true,
    },
  });

  if (!customerData)
    throw new Error(`Customer lookup failed: Customer not found.`);

  const { id: uuid } = customerData!;

  const subscription = await stripe.subscriptions.retrieve(subscriptionId, {
    expand: ["default_payment_method"],
  });

  const subscriptionData = await prisma.subscription.upsert({
    where: { id: subscription.id, userId: uuid },
    create: {
      id: subscription.id,
      userId: uuid,
      metadata: subscription.metadata,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity || 1,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at
        ? new Date(subscription.cancel_at)
        : null,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at)
        : null,
      currentPeriodStart: new Date(subscription.current_period_start),
      currentPeriodEnd: new Date(subscription.current_period_end),
      created: new Date(subscription.created),
      endedAt: subscription.ended_at ? new Date(subscription.ended_at) : null,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end)
        : null,
    },
    update: {
      metadata: subscription.metadata,
      status: subscription.status,
      priceId: subscription.items.data[0].price.id,
      quantity: subscription.items.data[0].quantity,
      cancelAtPeriodEnd: subscription.cancel_at_period_end,
      cancelAt: subscription.cancel_at
        ? new Date(subscription.cancel_at)
        : null,
      canceledAt: subscription.canceled_at
        ? new Date(subscription.canceled_at)
        : null,
      currentPeriodStart: new Date(subscription.current_period_start),
      currentPeriodEnd: new Date(subscription.current_period_end),
      created: new Date(subscription.created),
      endedAt: subscription.ended_at ? new Date(subscription.ended_at) : null,
      trialStart: subscription.trial_start
        ? new Date(subscription.trial_start)
        : null,
      trialEnd: subscription.trial_end
        ? new Date(subscription.trial_end)
        : null,
    },
  });

  if (!subscriptionData) throw new Error(`Subscription insert/update failed`);

  console.log(
    `Inserted/updated subscription [${subscription.id}] for user [${uuid}]`,
  );

  // For a new subscription copy the billing details to the customer object.
  // NOTE: This is a costly operation and should happen at the very end.
  if (createAction && subscription.default_payment_method && uuid)
    //@ts-ignore
    await copyBillingDetailsToCustomer(
      uuid,
      subscription.default_payment_method as Stripe.PaymentMethod,
    );
};

export {
  upsertProductRecord,
  upsertPriceRecord,
  deleteProductRecord,
  deletePriceRecord,
  createOrRetrieveCustomer,
  manageSubscriptionStatusChange,
};
