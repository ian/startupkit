import { getSession } from "@/auth/server";
import Pricing from "./components/Pricing";
import { prisma } from "prisma/client";

export default async function PricingPage() {
  const { user } = await getSession();

  const products = await prisma.product.findMany({
    where: {
      active: true,
    },
    include: {
      prices: {
        where: {
          active: true,
        },
      },
    },
  });

  let subscription;
  if (user) {
    subscription = await prisma.subscription.findFirst({
      where: {
        userId: user.id,
        status: {
          in: ["trialing", "active"],
        },
      },
      select: {
        price: {
          select: {
            product: true,
          },
        },
      },
    });
  }

  return (
    <Pricing
      products={products ?? []}
      subscription={subscription}
      user={user}
    />
  );
}
