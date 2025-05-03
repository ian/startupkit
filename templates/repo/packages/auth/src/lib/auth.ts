import { prisma } from "@repo/db"
import { sendOTPEmail } from "@repo/emails"
import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { admin, createAuthMiddleware, emailOTP } from "better-auth/plugins"

const additionalFields = {
	user: {
		additionalFields: {
			firstName: {
				type: "string",
				required: false
			},
			lastName: {
				type: "string",
				required: false
			},
			phone: {
				type: "string",
				required: false
			}
		}
	}
} as const

export const auth = betterAuth({
	...additionalFields,
	basePath: "/auth",
	account: {
		accountLinking: {
			enabled: true
		}
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql"
	}),
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			const { newSession } = ctx.context

			if (newSession) {
				await prisma.user.update({
					where: {
						id: newSession.user.id
					},
					data: {
						lastSeenAt: new Date()
					}
				})

				// TODO - check if ctx.path.startsWith("/sign-up") and fire analytics event
				// SEE [BOT-179: Analytics - Add Signed Up vs Signed In](https://linear.app/hotsheet/issue/BOT-179/analytics-add-signed-up-vs-signed-in)
			}
		})
	},
	plugins: [
		admin(),
		emailOTP({
			sendVerificationOTP
		}),
		nextCookies()
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7, // 7 days
		updateAge: 60 * 60 * 24 // 1 day (every 1 day the session expiration is updated)
	},
	socialProviders: {
		google: {
			clientId: process.env.GOOGLE_CLIENT_ID as string,
			clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
			mapProfileToUser: async (profile) => {
				return {
					name: `${profile.given_name} ${profile.family_name}`,
					firstName: profile.given_name,
					lastName: profile.family_name,
					image: profile.picture
				}
			}
		}
	}
})

/**
 * Sends a one-time password (OTP) email for user verification.
 *
 * @param email - The recipient's email address.
 * @param otp - The OTP code to be sent.
 * @param type - The type of verification (e.g., sign-in, sign-up).
 */
async function sendVerificationOTP({
	email,
	otp,
	type
}: { email: string; otp: string; type: string }) {
	console.log("Sending email to", { email, otp })

	await sendOTPEmail({
		email,
		otpCode: otp,
		expiryTime: "10 minutes"
	})
}
