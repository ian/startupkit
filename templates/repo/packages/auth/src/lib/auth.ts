import { track } from "@repo/analytics/server"
import { db, users } from "@repo/db"
import { sendEmail } from "@repo/emails"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { createAuthMiddleware, emailOTP } from "better-auth/plugins"
import { eq } from "drizzle-orm"

async function sendVerificationOTP({
	email,
	otp
}: { email: string; otp: string }) {
	await sendEmail({
		template: "VerifyCode",
		from: "hello@startupkit.com",
		to: email,
		subject: "Verify your email",
		props: {
			email,
			otpCode: otp,
			expiryTime: "10 minutes"
		}
	})
}

export const auth = betterAuth({
	basePath: "/auth",
	database: drizzleAdapter(db, {
		provider: "pg"
	}),
	account: {
		accountLinking: {
			enabled: true
		}
	},
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
	},
	hooks: {
		after: createAuthMiddleware(async (ctx) => {
			const { newSession, newUser } = ctx.context

			if (newSession) {
				await db
					.update(users)
					.set({
						lastSeenAt: new Date()
					} as unknown as typeof users.$inferInsert)
					.where(eq(users.id, newSession.user.id))

				const [user] = await db
					.select({
						id: users.id,
						email: users.email,
						firstName: users.firstName,
						lastName: users.lastName
					})
					.from(users)
					.where(eq(users.id, newSession.user.id))
					.limit(1)

				if (user?.email) {
					await track({
						event: newUser ? "USER_SIGNED_UP" : "USER_SIGNED_IN",
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
	},
	plugins: [
		emailOTP({
			sendVerificationOTP
		}),
		nextCookies()
	],
	session: {
		expiresIn: 60 * 60 * 24 * 7,
		updateAge: 60 * 60 * 24
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
