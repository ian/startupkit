export const prisma = new Proxy(
	{},
	{
		get: () => {
			return () => {
				console.warn("Prisma called in Storybook")
				return Promise.resolve([])
			}
		}
	}
)

export const Prisma = {
	Decimal: class Decimal {
		constructor(value: any) {
			return value
		}
	},
	JsonObject: {},
	JsonArray: [],
	JsonValue: {}
}

export enum TeamRole {
	OWNER = "OWNER",
	MEMBER = "MEMBER",
	ADMIN = "ADMIN"
}

export enum AgentStatus {
	ACTIVE = "ACTIVE",
	INACTIVE = "INACTIVE"
}

export enum MessageRole {
	USER = "user",
	ASSISTANT = "assistant",
	SYSTEM = "system"
}

export enum Visibility {
	PRIVATE = "PRIVATE",
	PUBLIC = "PUBLIC",
	TEAM = "TEAM"
}

export enum IngestionStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	FAILED = "FAILED"
}

export enum AgentType {
	BROKERBOT = "BROKERBOT",
	SALES = "SALES",
	SUPPORT = "SUPPORT"
}

export enum ChatSource {
	WEB = "WEB",
	SLACK = "SLACK",
	SMS = "SMS"
}

export enum TrainingStatus {
	PENDING = "PENDING",
	PROCESSING = "PROCESSING",
	COMPLETED = "COMPLETED",
	FAILED = "FAILED"
}

export enum UploadVisibility {
	PRIVATE = "PRIVATE",
	TEAM = "TEAM",
	PUBLIC = "PUBLIC"
}

export enum RoutingType {
	ROUND_ROBIN = "ROUND_ROBIN",
	BROADCAST = "BROADCAST"
}

export enum SeatType {
	lite = "lite",
	standard = "standard"
}

export const createRootTeam = () => ({})

export const createSubTeam = () => ({})

export const getRootTeamId = () => "stub-root-team-id"

// We intentionally do NOT re-export * from @prisma/client to avoid pulling in the real client
// which causes issues with Vite/Storybook in the browser.
// Types should be handled by TypeScript via the real package.json.
