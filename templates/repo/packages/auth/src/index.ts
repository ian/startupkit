import {
	createAuthClient,
	emailOTPClient
} from "@startupkit/auth"
import { adminClient } from "better-auth/client/plugins"
import type { auth } from "./lib/auth"

export * from "./components"
export * from "./types"

export const authClient = createAuthClient({
	basePath: "/auth",
	plugins: [
		adminClient(),
		emailOTPClient()
	]
})
