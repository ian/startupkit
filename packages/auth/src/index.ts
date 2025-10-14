export * from "./components"
export { createAuth } from "./lib/auth"
export * from "./types"

export {
    anonymousClient,
    apiKeyClient,
    clientSideHasPermission,
    customSessionClient,
    emailOTPClient,
    genericOAuthClient,
    getPasskeyActions,
    inferAdditionalFields,
    inferOrgAdditionalFields,
    jwtClient,
    lastLoginMethodClient,
    magicLinkClient,
    multiSessionClient,
    oidcClient,
    oneTapClient,
    oneTimeTokenClient,
    organizationClient,
    passkeyClient,
    phoneNumberClient,
    siweClient,
    ssoClient,
    usernameClient
} from "better-auth/client/plugins"
export type { InferServerPlugin } from "better-auth/client/plugins"
export { createAuthClient } from "better-auth/react"

