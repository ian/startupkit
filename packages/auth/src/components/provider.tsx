"use client"

import { useRouter } from "next/navigation"
import type React from "react"
import { useEffect } from "react"
import { AuthContext } from "./context"

interface AuthProviderProps<TUser = Record<string, unknown>> {
  children: React.ReactNode
  user?: TUser
  authClient: {
    useSession: () => {
      data?: { user?: TUser } | null
      isPending: boolean
      refetch: () => void | Promise<void>
    }
    emailOtp?: {
      sendVerificationOtp?: (params: { email: string; type: string }) => Promise<void>
    }
    signIn: {
      emailOtp?: (params: { email: string; otp: string }) => Promise<void>
      social?: (params: { provider: string }) => Promise<void>
    }
    signOut: () => Promise<void>
  }
  onIdentify?: (user: TUser) => void
  onReset?: () => void
}

export function AuthProvider<TUser = Record<string, unknown>>({
  children,
  user: initialUser,
  authClient,
  onIdentify,
  onReset
}: AuthProviderProps<TUser>) {
  const router = useRouter()
  const { data, refetch, isPending: isLoading } = authClient.useSession()

  const { user } = data ?? { user: initialUser }

  useEffect(() => {
    if (user && onIdentify) {
      onIdentify(user)
    }
  }, [user, onIdentify])

  const sendAuthCode = async (email: string) => {
    if (!authClient.emailOtp?.sendVerificationOtp) {
      throw new Error("Email OTP is not configured")
    }
    await authClient.emailOtp.sendVerificationOtp({
      email,
      type: "sign-in"
    })
  }

  const verifyAuthCode = async (email: string, otp: string) => {
    if (!authClient.signIn.emailOtp) {
      throw new Error("Email OTP sign-in is not configured")
    }
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
    if (!authClient.signIn.social) {
      throw new Error("Social sign-in is not configured")
    }
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

  return <AuthContext.Provider value={value as never}>{children}</AuthContext.Provider>
}

