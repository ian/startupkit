import { Flags, getFeatureFlags } from "@repo/analytics/server"
import { toNextJsHandler } from "better-auth/next-js"
import { headers } from "next/headers"
import { auth } from "./lib/auth"
export { auth } from "./lib/auth"
export * from "./types"

export const withAuth = async (
	opts: { flags?: boolean } = { flags: false }
) => {
	const session = await auth.api.getSession({
		headers: await headers()
	})

	if (session) {
		let flags: Flags | undefined = undefined

		if (opts.flags) {
			flags = await getFeatureFlags(session?.user?.id)
		}

		return {
			...session,
			flags
		}
	}

	return { user: null, session: null, flags: undefined }
}

export const handler = () => toNextJsHandler(auth.handler)
