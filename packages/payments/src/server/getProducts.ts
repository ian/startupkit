import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function getProducts() {
  return prisma.product.findMany({
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
}
