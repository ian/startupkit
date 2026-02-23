"use client"

import { useAnalytics } from "@repo/analytics"
import { AuthProvider as StartupKitAuthProvider } from "@startupkit/auth"
import type React from "react"
import { authClient } from "../index"
import type { User } from "../types"

interface AuthProviderProps {
	children: React.ReactNode
	user?: User
}

/**
 * Auth Provider - Wraps @startupkit/auth provider with analytics integration
 *
 * Uses better-auth directly (via authClient) and integrates with your analytics
 */
export function AuthProvider({ children, user }: AuthProviderProps) {
	const { identify, reset } = useAnalytics()

	return (
		<StartupKitAuthProvider
			authClient={authClient}
			user={user}
			onIdentify={(user: User) => {
				const analyticsProps: Record<string, string | number | boolean> = {}
				for (const [key, value] of Object.entries(user)) {
					if (
						key !== "id" &&
						(typeof value === "string" ||
							typeof value === "number" ||
							typeof value === "boolean")
					) {
						analyticsProps[key] = value
					}
				}

				identify(user.id, analyticsProps)
			}}
			onReset={() => {
				reset()
			}}
		>
			{children}
		</StartupKitAuthProvider>
	)
}
