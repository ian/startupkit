"use client";

import useSWR from "swr";
import { useRouter } from "next/navigation";
import { SessionData } from "../types";

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export const useAuth = () => {
  const router = useRouter();
  const {
    data: session,
    // error,
    mutate,
  } = useSWR<SessionData>("/api/auth/session", fetcher);

  const login = () => {
    router.push("/api/auth/login");
  };

  const logout = async () => {
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST" }),
      mutate(undefined),
    ]);
  };

  return { user: session?.user, login, logout };
};
