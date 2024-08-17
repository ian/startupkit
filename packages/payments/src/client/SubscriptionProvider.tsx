"use client";

import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { type Subscription } from "@prisma/client";

export function SubscriptionProvider({
  children,
  subscription,
}: {
  children: ReactNode;
  subscription?: Subscription | null;
}) {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/payments/subscription": subscription,
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
