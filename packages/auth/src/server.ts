import { toNextJsHandler } from "better-auth/next-js"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export function createServerUtils(
	auth: ReturnType<typeof import("better-auth").betterAuth>
) {
	const withAuth = async () => {
		const session = await auth.api.getSession({
			headers: await headers()
		})

		if (session) {
			return {
				...session
			}
		}

		return { user: null, session: null }
	}

	const requireAuth = async (redirectTo = "/sign-in") => {
		const session = await auth.api.getSession({
			headers: await headers()
		})

		if (!session) {
			redirect(redirectTo)
		}

		return session
	}

	const handler = () => toNextJsHandler(auth.handler)

	return {
		auth,
		withAuth,
		requireAuth,
		handler
	}
}
