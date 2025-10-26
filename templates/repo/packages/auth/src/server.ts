// @repo/auth/server - Server-side auth configuration
// Imports directly from better-auth and uses @startupkit/auth helpers

import { getFeatureFlags, track } from "@repo/analytics/server"
import { prisma } from "@repo/db"
import { sendEmail } from "@repo/emails"
import { createAuth } from "@startupkit/auth"
import { headers } from "next/headers"

// Create auth instance with your project's configuration
export const auth = createAuth({
	prisma,
	sendEmail: async ({ email, otp }) => {
		await sendEmail({
			from: "noreply@startupkit.com",
			to: email,
			subject: "Your verification code",
			template: "VerifyCode",
			props: {
				email,
				otpCode: otp,
				expiryTime: "10 minutes"
			}
		})
	},
	onUserLogin: async (userId: string) => {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true, firstName: true, lastName: true }
		})
		if (user?.email) {
			await track({
				event: "USER_SIGNED_IN",
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName
				}
			})
		}
	},
	onUserSignup: async (userId: string) => {
		const user = await prisma.user.findUnique({
			where: { id: userId },
			select: { id: true, email: true, firstName: true, lastName: true }
		})
		if (user?.email) {
			await track({
				event: "USER_SIGNED_UP",
				user: {
					id: user.id,
					email: user.email,
					firstName: user.firstName,
					lastName: user.lastName
				}
			})
		}
	}
})

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user

// Export auth handlers
export const handler = auth.handler

// Helper to get auth session in Server Components
export async function withAuth(opts?: { flags?: boolean }) {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	const flags = opts?.flags && session?.user
		? await getFeatureFlags(session.user.id)
		: undefined

	return {
		user: session?.user ?? null,
		session: session?.session ?? null,
		flags
	}
}
