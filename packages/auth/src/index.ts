import {
    adminClient,
    emailOTPClient,
    inferAdditionalFields
} from "better-auth/client/plugins"
import { createAuthClient } from "better-auth/react"

export * from "./components"
export { createAuth } from "./lib/auth"
export * from "./types"

export function createBetterAuthClient() {
    return createAuthClient({
        basePath: "/auth",
        plugins: [
            adminClient(),
            emailOTPClient(),
            inferAdditionalFields()
        ]
    })
}

