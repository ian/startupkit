import { betterAuth } from "better-auth"
import { drizzleAdapter } from "better-auth/adapters/drizzle"
import { nextCookies } from "better-auth/next-js"
import { admin, createAuthMiddleware, emailOTP } from "better-auth/plugins"
import { eq } from "drizzle-orm"
import type { AuthConfig } from "../types"

const defaultAdditionalFields = {
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

export function createAuth<
    TUsers extends object = object,
    TAdditionalFields extends Record<string, import("../types").AdditionalField> = Record<string, import("../types").AdditionalField>
>(
    config: AuthConfig<TUsers, TAdditionalFields>
) {
    const {
        db,
        users,
        sendEmail,
        onUserLogin,
        onUserSignup,
        additionalUserFields,
        session: sessionConfig
    } = config

    const mergedFields = {
        ...defaultAdditionalFields,
        ...additionalUserFields
    }

    const additionalFields = {
        user: {
            additionalFields: mergedFields
        }
    } as const

    return betterAuth({
        ...additionalFields,
        basePath: "/auth",
        account: {
            accountLinking: {
                enabled: true
            }
        },
        database: drizzleAdapter(db, {
            provider: "pg"
        }),
        hooks: {
            after: createAuthMiddleware(async (ctx) => {
                const { newSession, newUser } = ctx.context

                if (newSession) {
                    await db
                        .update(users)
                        .set({ lastSeenAt: new Date() })
                        // @ts-expect-error - users is a generic Drizzle table, TypeScript can't verify .id exists but it will at runtime
                        .where(eq(users.id, newSession.user.id))

                    if (newUser && onUserSignup) {
                        await onUserSignup(newSession.user.id)
                    } else if (onUserLogin) {
                        await onUserLogin(newSession.user.id)
                    }
                }
            })
        },
        plugins: [
            admin(),
            emailOTP({
                sendVerificationOTP: sendEmail
            }),
            nextCookies()
        ],
        session: {
            expiresIn: sessionConfig?.expiresIn ?? 60 * 60 * 24 * 7,
            updateAge: sessionConfig?.updateAge ?? 60 * 60 * 24
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

