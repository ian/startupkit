import "@/styles/app.css";
import { AuthProvider } from "@startupkit/auth";
import { getSession } from "@startupkit/auth/server";
import { SubscriptionProvider } from "@startupkit/payments";
import { getSubscription } from "@startupkit/payments/server";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New StartupKit App",
  description: "The SaaS Framework: https://startupkit.com",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const subscription = await getSubscription(session?.user.id);

  return (
    <html lang="en">
      <body style={{ padding: 0, margin: 0 }}>
        <AuthProvider session={session}>
          <SubscriptionProvider subscription={subscription}>
            {children}
          </SubscriptionProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
