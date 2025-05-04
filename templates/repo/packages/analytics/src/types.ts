import type { User } from "@repo/db"

export type AnalyticsEvent = AuthEvent | TrackableEvent

export type AuthUser = Pick<User, "id" | "email" | "firstName" | "lastName">
export type AuthEvent = UserSignedIn | UserSignedUp | UserSignedOut

export type IdentityOptions = { userId: string; anonymousId?: string }

export type TrackableEvent = IdentityOptions &
	(TeamCreated | TeamJoined | TeamSwitched)

// ####################################
// Auth

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

// ####################################
// Teams

export type TeamCreated = {
	event: "TEAM_CREATED"
	teamId: string
}

export type TeamJoined = {
	event: "TEAM_JOINED"
	teamId: string
}

export type TeamSwitched = {
	event: "TEAM_SWITCHED"
	teamId: string
}

// ####################################
// TODO - Add more custom tracking events
