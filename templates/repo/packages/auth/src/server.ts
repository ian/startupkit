// @repo/auth/server - Server-side auth configuration
// Imports directly from better-auth and uses @startupkit/auth helpers

import { track } from "@repo/analytics/server"
import { prisma } from "@repo/db"
import { sendEmail } from "@repo/emails"
import { createAuth } from "@startupkit/auth"

// Create auth instance with your project's configuration
export const auth = createAuth({
	prisma,
	sendEmail: async ({ email, otp }) => {
		await sendEmail({
			to: email,
			template: "verify-code",
			props: { code: otp }
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
