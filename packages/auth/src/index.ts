export * from "./components"
export { createAuth } from "./lib/auth"
export * from "./types"

// Re-export better-auth utilities for full flexibility
export * from "better-auth/client/plugins"
export { createAuthClient } from "better-auth/react"

