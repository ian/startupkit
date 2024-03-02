import { getSession } from "@/auth/server";
import { CustomerPortalForm } from "@/components/AccountForms/CustomerPortalForm";
// import EmailForm from "@/components/ui/AccountForms/EmailForm";
// import NameForm from "@/components/ui/AccountForms/NameForm";
import { redirect } from "next/navigation";
import { prisma } from "prisma/client";

export default async function Account() {
  const { user } = await getSession();
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

  if (!user) {
    return redirect("/signin");
  }

  return (
    <section className="mb-32">
      <div className="max-w-6xl px-4 py-8 mx-auto sm:px-6 sm:pt-24 lg:px-8">
        <div className="sm:align-center sm:flex sm:flex-col">
          <h1 className="text-4xl font-extrabold sm:text-center sm:text-6xl">
            Account
          </h1>
          <p className="max-w-2xl m-auto mt-5 text-xl text-gray-500 sm:text-center sm:text-2xl">
            We partnered with Stripe for a simplified billing.
          </p>
        </div>
      </div>
      <div className="p-4">
        <CustomerPortalForm subscription={subscription} />
        {/* <NameForm userName={userDetails?.full_name ?? ""} />
        <EmailForm userEmail={user.email} /> */}
      </div>
    </section>
  );
}
