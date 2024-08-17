import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getSubscription(userId: string) {
  if (!userId) return null;

  return prisma.subscription.findFirst({
    where: {
      userId,
      status: {
        in: ["trialing", "active"],
      },
    },
    include: {
      price: {
        include: {
          product: true,
        },
      },
    },
  });
}
