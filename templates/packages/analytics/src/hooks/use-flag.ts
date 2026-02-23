import { useFlag as useStartupKitFlag } from "@startupkit/analytics"
import type { FlagName, Flags } from "../vendor/posthog"

export function useFlag<T extends FlagName>(name: T) {
	return useStartupKitFlag<Flags, T>(name)
}
