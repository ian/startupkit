"use client"

import { useAnalytics } from "@repo/analytics"
import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { authClient } from "../client"
import type { User } from "../types"
import { AuthContext } from "./context"

export function AuthProvider({
	children,
	user: initialUser
}: {
	children: React.ReactNode
	user?: User
}) {
	const analytics = useAnalytics()
	const router = useRouter()
	const { data, refetch, isPending: isLoading } = authClient.useSession()

	const { user } = data ?? {
		user: initialUser
	}

	useEffect(() => {
		if (user) {
			analytics.identify(user.id, {
				name: user.name,
				email: user.email,
				phone: user.phone ?? null
			})
		}
	}, [user])

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
		analytics.reset()
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
