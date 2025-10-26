"use client"

import { useAnalytics } from "@repo/analytics"
import { AuthProvider as StartupKitAuthProvider } from "@startupkit/auth"
import type React from "react"
import { authClient } from "../index"

interface AuthProviderProps<TUser = Record<string, unknown>> {
	children: React.ReactNode
	user?: TUser
}

/**
 * Auth Provider - Wraps @startupkit/auth provider with analytics integration
 *
 * Uses better-auth directly (via authClient) and integrates with your analytics
 */
export function AuthProvider<TUser = Record<string, unknown>>({
	children,
	user
}: AuthProviderProps<TUser>) {
	const { identify, reset } = useAnalytics()

	return (
		<StartupKitAuthProvider
			authClient={authClient}
			user={user}
			onIdentify={(user) => {
				if (user && "id" in user && "email" in user) {
					identify(user.id as string, {
						email: user.email as string,
						...(user as Record<string, unknown>)
					})
				}
			}}
			onReset={() => {
				reset()
			}}
		>
			{children}
		</StartupKitAuthProvider>
	)
}
