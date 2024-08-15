"use client";

import { useRouter } from "next/navigation";
import { useContext } from "react";
import { AuthContext } from "../providers/AuthProvider";

export const useAuth = () => {
  const { user, mutateUser } = useContext(AuthContext);
  const router = useRouter();

  const login = () => {
    router.push("/api/auth/login");
  };

  const logout = async () => {
    await Promise.all([
      fetch("/api/auth/logout", { method: "POST" }),
      mutateUser(undefined),
    ]);
  };

  return { user, login, logout };
};
