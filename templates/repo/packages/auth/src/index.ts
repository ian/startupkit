// @repo/auth - Your customizable auth implementation
// Imports directly from better-auth - you control the version!

import { adminClient, emailOTPClient } from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export * from "./components"
export * from "./types"

// Create auth client with your project's configuration
// Note: Type assertions needed due to plugin type complexities
export const authClient = createAuthClient({
	basePath: "/auth",
	plugins: [adminClient(), emailOTPClient()]
})
