// @repo/auth - Your customizable auth implementation
// Imports directly from better-auth - you control the version!

import { adminClient, emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export * from "./components"
export * from "./types"

export const authClient = createAuthClient({
	basePath: "/auth",
	plugins: [adminClient(), emailOTPClient()]
})
