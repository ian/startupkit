"use client";

import { User } from "@prisma/client";
import { createContext, ReactNode } from "react";
import useSWR from "swr";

interface AuthContextType {
  user: User | undefined;
  mutateUser: (user: User | undefined) => void;
  isLoading: boolean;
  error: Error | null;
}

export const AuthContext = createContext<AuthContextType>({
  user: undefined,
  mutateUser: () => {},
  isLoading: true,
  error: null,
});

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export function AuthProvider({ children }: { children: ReactNode }) {
  const { data: user, error, mutate } = useSWR<User>("/api/auth/user", fetcher);

  const value = {
    user: user ?? undefined,
    mutateUser: mutate,
    isLoading: !error && !user,
    error,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
