import { getFeatureFlags } from "@repo/analytics/server"
import { toNextJsHandler } from "better-auth/next-js"
import { headers } from "next/headers"
import { auth } from "./lib/auth"

export { auth }

export type Session = typeof auth.$Infer.Session.session
export type User = typeof auth.$Infer.Session.user

export function handler() {
	return toNextJsHandler(auth.handler)
}

export async function withAuth(opts?: { flags?: boolean }) {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	const flags =
		opts?.flags && session?.user
			? await getFeatureFlags(session.user.id)
			: undefined

	return {
		user: session?.user ?? null,
		session: session?.session ?? null,
		flags
	}
}
