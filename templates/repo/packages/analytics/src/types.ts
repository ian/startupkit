import type { User } from "@local/db"

export type AnalyticsEvent = AuthEvent | TrackableEvent
export type AnalyticsSource =
  | "slack"
  | "web"
  | "pwa"
  | "mobile"
  | "sms"
  | "voice"

export type AuthUser = Pick<User, "id" | "email" | "firstName" | "lastName">
export type AuthEvent =
  | UserSignedIn
  | UserSignedUp
  | UserSignedOut

export type UserSignedIn = {
  event: "USER_SIGNED_IN"
  user: AuthUser
}

export type UserSignedUp = {
  event: "USER_SIGNED_UP"
  user: AuthUser
}

export type UserSignedOut = {
  event: "USER_SIGNED_OUT"
  user: AuthUser
}

export type IdentityOptions = { userId: string; anonymousId?: string }

export type TrackableEvent = IdentityOptions &
  (
    | ExampleEvent
    // | ExampleEvent
    // | ExampleEvent
  )

export type ExampleEvent = {
  event: "EXAMPLE_EVENT"
  msg: string
}