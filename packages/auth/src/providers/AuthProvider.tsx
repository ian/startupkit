"use server";

import { ReactNode } from "react";
import { SWRConfig } from "swr";
import { getUser } from "../server";
import { AuthProviderClient } from "./AuthProviderClient";

export async function AuthProvider({ children }: { children: ReactNode }) {
  const user = await getUser();

  return (
    <SWRConfig
      value={{
        fallback: {
          "/api/auth/user": user,
        },
      }}
    >
      <AuthProviderClient>{children}</AuthProviderClient>
    </SWRConfig>
  );
}
