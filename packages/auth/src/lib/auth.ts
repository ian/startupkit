import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { nextCookies } from "better-auth/next-js"
import { admin, createAuthMiddleware, emailOTP } from "better-auth/plugins"
import type { AuthConfig } from "../types"

const additionalFields = {
    user: {
        additionalFields: {
            firstName: {
                type: "string" as const,
                required: false
            },
            lastName: {
                type: "string" as const,
                required: false
            },
            phone: {
                type: "string" as const,
                required: false
            }
        }
    }
} as const

export function createAuth(config: AuthConfig) {
    const { prisma, sendEmail, onUserLogin, onUserSignup } = config

    const defaultSendEmail = async ({ email, otp }: { email: string; otp: string }) => {
        console.log(`[Auth] OTP for ${email}: ${otp}`)
    }

    return betterAuth({
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

                    if (onUserLogin) {
                        await onUserLogin(newSession.user.id)
                    }
                }
            })
        },
        plugins: [
            admin(),
            emailOTP({
                sendVerificationOTP: sendEmail || defaultSendEmail
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
}

