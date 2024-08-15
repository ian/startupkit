import { getSession } from "@startupkit/auth/server";
import { getSubscription } from "@startupkit/payments/server";
import { CustomerPortalForm } from "@/components/app/customer-portal";

export default async function Account() {
  const { user } = await getSession();
  const subscription = await getSubscription(user.id);

  return (
    <section className="mb-32">
      <div className="max-w-2xl p-4 mx-auto">
        <CustomerPortalForm subscription={subscription} />
      </div>
    </section>
  );
}
