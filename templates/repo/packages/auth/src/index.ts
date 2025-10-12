import {
	adminClient,
	createAuthClient,
	emailOTPClient,
	inferAdditionalFields
} from "@startupkit/auth"
import type { auth } from "./lib/auth"

export * from "./components"
export * from "./types"

export const authClient = createAuthClient({
	basePath: "/auth",
	plugins: [
		adminClient(),
		emailOTPClient(),
		inferAdditionalFields<typeof auth>()
	]
})
