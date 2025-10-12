import {
	adminClient,
	emailOTPClient,
	inferAdditionalFields
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"
import type { auth } from "./lib/auth"

export * from "./components"
export * from "./types"

const config = {
	basePath: "/auth",
	plugins: [
		adminClient(),
		emailOTPClient(),
		inferAdditionalFields<typeof auth>()
	]
}

export const authClient = createAuthClient(config)
