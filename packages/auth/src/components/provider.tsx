"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect } from "react"
import type { User } from "../types"
import { AuthContext } from "./context"

interface AuthProviderProps {
  children: React.ReactNode
  user?: User
  authClient: {
    useSession: () => {
      data?: { user?: User }
      isPending: boolean
      refetch: () => Promise<void>
    }
    emailOtp: {
      sendVerificationOtp: (params: { email: string; type: string }) => Promise<void>
    }
    signIn: {
      emailOtp: (params: { email: string; otp: string }) => Promise<void>
      social: (params: { provider: string }) => Promise<void>
    }
    signOut: () => Promise<void>
  }
  onIdentify?: (user: User) => void
  onReset?: () => void
}

export function AuthProvider({
  children,
  user: initialUser,
  authClient,
  onIdentify,
  onReset
}: AuthProviderProps) {
  const router = useRouter()
  const { data, refetch, isPending: isLoading } = authClient.useSession()

  const { user } = data ?? { user: initialUser }

  useEffect(() => {
    if (user && onIdentify) {
      onIdentify(user)
    }
  }, [user, onIdentify])

  const sendAuthCode = async (email: string) => {
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in"
    })
  }

  const verifyAuthCode = async (email: string, otp: string) => {
    try {
      await authClient.signIn.emailOtp({
        email,
        otp
      })
    } finally {
      void refetch()
    }
  }

  const googleAuth = async () => {
    await authClient.signIn.social({
      provider: "google"
    })
  }

  const logout = async () => {
    await authClient.signOut()
    await refetch()
    if (onReset) {
      onReset()
    }
    router.push("/")
  }

  const value = {
    isLoading,
    isAuthenticated: Boolean(user),
    user,
    logout,
    sendAuthCode,
    verifyAuthCode,
    googleAuth
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

