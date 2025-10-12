"use client"

import { useAnalytics } from "@repo/analytics"
import { AuthProvider as BaseAuthProvider } from "@startupkit/auth"
import type React from "react"
import { authClient } from ".."
import type { User } from "../types"

export function AuthProvider({
  children,
  user: initialUser
}: {
  children: React.ReactNode
  user?: User
}) {
  const analytics = useAnalytics()

  const handleIdentify = (user: User) => {
    analytics.identify(user.id, {
      name: user.name,
      email: user.email,
      phone: user.phone ?? null
    })
  }

  const handleReset = () => {
    analytics.reset()
  }

  return (
    <BaseAuthProvider
      user={initialUser}
      authClient={authClient}
      onIdentify={handleIdentify}
      onReset={handleReset}
    >
      {children}
    </BaseAuthProvider>
  )
}
