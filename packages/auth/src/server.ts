import { toNextJsHandler } from "better-auth/next-js"
import { headers } from "next/headers"

export function createServerUtils(auth: ReturnType<typeof import("better-auth").betterAuth>) {
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

  const handler = () => toNextJsHandler(auth.handler)

  return {
    auth,
    withAuth,
    handler
  }
}
