"use client"

import { useAnalytics } from "@repo/analytics"
import { AuthProvider as StartupKitAuthProvider } from "@startupkit/auth"
import type React from "react"
import { authClient } from "../index"

interface AuthProviderProps {
	children: React.ReactNode
	user?: unknown
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
			authClient={authClient as never}
			user={user}
			onIdentify={(user: unknown) => {
				if (
					user &&
					typeof user === "object" &&
					user !== null &&
					"id" in user &&
					"email" in user
				) {
					const typedUser = user as Record<string, unknown> & {
						id: string
						email: string
					}

					// Filter to only properties analytics accepts
					const analyticsProps: Record<string, string | number | boolean> = {}
					for (const [key, value] of Object.entries(typedUser)) {
						if (
							key !== "id" &&
							(typeof value === "string" ||
								typeof value === "number" ||
								typeof value === "boolean")
						) {
							analyticsProps[key] = value
						}
					}

					identify(typedUser.id, analyticsProps)
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
