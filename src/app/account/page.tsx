import { getSession } from "@/auth/server";
import { CustomerPortalForm } from "@/components/CustomerPortalForm";
import { redirect } from "next/navigation";
import { prisma } from "prisma/client";

export default async function Account() {
  const { user } = await getSession();

  if (!user) {
    return redirect("/");
  }

  const subscription = await prisma.subscription.findFirst({
    where: {
      userId: user.id,
    },
    include: {
      price: {
        include: {
          product: true,
        },
      },
    },
  });

  return (
    <section className="mb-32">
      <div className="max-w-2xl p-4 mx-auto">
        <CustomerPortalForm subscription={subscription} />
      </div>
    </section>
  );
}
