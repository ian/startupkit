import { toNextJsHandler } from "better-auth/next-js"
import { headers } from "next/headers"
import { auth } from "./lib/auth"

export { auth } from "./lib/auth"
export * from "./types"

export const withAuth = async () => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	return session ?? { user: null, session: null }
}

export const handler = () => toNextJsHandler(auth.handler)
