import { track } from "@repo/analytics/server"
import * as dbSchema from "@repo/db"
import { sendEmail } from "@repo/emails"
import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { createAuthMiddleware, emailOTP } from "better-auth/plugins"
import { eq } from "drizzle-orm"

type BetterAuthInstance = ReturnType<typeof betterAuth>

const globalForAuth = globalThis as unknown as { auth?: BetterAuthInstance }

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

function createAuth(): BetterAuthInstance {
	return betterAuth({
		secret: process.env.BETTER_AUTH_SECRET,
		basePath: "/auth",
		trustedOrigins: process.env.BETTER_AUTH_TRUSTED_ORIGINS
			? process.env.BETTER_AUTH_TRUSTED_ORIGINS.split(",")
			: ["http://localhost:2274"],
		advanced: {
			generateId: () => crypto.randomUUID()
		},
		logger: {
			disabled: false,
			disableColors: false,
			level: "error",
			log: (level, message, ...args) => {
				console.log(`[${level}] ${message}`, ...args)
			}
		},
		database: drizzleAdapter(dbSchema.db, {
			provider: "pg",
			schema: {
				user: dbSchema.users,
				account: dbSchema.accounts,
				session: dbSchema.sessions,
				verification: dbSchema.verifications
			}
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
					await dbSchema.db
						.update(dbSchema.users)
						.set({
							lastSeenAt: new Date()
						} as unknown as typeof dbSchema.users.$inferInsert)
						.where(eq(dbSchema.users.id, newSession.user.id))

					const [user] = await dbSchema.db
						.select({
							id: dbSchema.users.id,
							email: dbSchema.users.email,
							firstName: dbSchema.users.firstName,
							lastName: dbSchema.users.lastName
						})
						.from(dbSchema.users)
						.where(eq(dbSchema.users.id, newSession.user.id))
						.limit(1)

					if (user?.email) {
						await track({
							event: newUser ? "USER_SIGNED_UP" : "USER_SIGNED_IN",
							userId: user.id,
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
			updateAge: 60 * 60 * 24,
			cookieCache: {
				enabled: true,
				maxAge: 60 * 5
			}
		},
		socialProviders: {
			google: {
				clientId: process.env.GOOGLE_CLIENT_ID || "",
				clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
				enabled: Boolean(
					process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
				),
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
}

export const auth = globalForAuth.auth ?? createAuth()

if (process.env.NODE_ENV !== "production") {
	globalForAuth.auth = auth
}
