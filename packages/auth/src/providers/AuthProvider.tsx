"use client";

import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { SessionData } from "../types";

export function AuthProvider({
  children,
  session,
}: {
  children: ReactNode;
  session?: SessionData;
}) {
  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/auth/session": session,
        },
      }}
    >
      {children}
    </SWRConfig>
  );
}
