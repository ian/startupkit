"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect } from "react"
import type { AnalyticsPlugin } from "../types"

interface AhrefsProviderProps {
	children: ReactNode
	apiKey?: string
}

/**
 * Ahrefs Analytics Provider component that injects the Ahrefs analytics script.
 * Automatically tracks page views once the script is loaded.
 *
 * @param apiKey - Ahrefs API key. Falls back to AHREFS_API_KEY or NEXT_PUBLIC_AHREFS_API_KEY env vars
 */
export function AhrefsProvider({ children, apiKey }: AhrefsProviderProps) {
	useEffect(() => {
		const AHREFS_KEY =
			apiKey ||
			process.env.AHREFS_API_KEY ||
			process.env.NEXT_PUBLIC_AHREFS_API_KEY

		if (AHREFS_KEY && !document.querySelector('script[src*="ahrefs.com"]')) {
			const script = document.createElement("script")
			script.src = "https://analytics.ahrefs.com/analytics.js"
			script.setAttribute("data-key", AHREFS_KEY)
			script.async = true
			document.head.appendChild(script)
		}
	}, [apiKey])

	return <>{children}</>
}

interface AhrefsOptions {
	key: string
}

/**
 * Ahrefs analytics plugin for the AnalyticsProvider.
 * Injects the Ahrefs analytics script which automatically tracks page views.
 *
 * @example
 * ```tsx
 * import { AnalyticsProvider, AhrefsPlugin } from "@startupkit/analytics"
 *
 * <AnalyticsProvider plugins={[AhrefsPlugin({ key: "your-ahrefs-key" })]}>
 *   {children}
 * </AnalyticsProvider>
 * ```
 *
 * @param options - Configuration options
 * @param options.key - Ahrefs API key
 */
export function AhrefsPlugin(options: AhrefsOptions): AnalyticsPlugin {
	return {
		name: "Ahrefs",
		Provider: ({ children }: { children: ReactNode }) => (
			<AhrefsProvider apiKey={options.key}>{children}</AhrefsProvider>
		),
		useHandlers: () => {
			const identify = useCallback(
				(_userId: string | null, _traits?: Record<string, unknown>) => {
					// Ahrefs doesn't expose a client-side identify API
				},
				[]
			)

			const track = useCallback(
				(_event: string, _properties?: Record<string, unknown>) => {
					// Ahrefs doesn't expose a client-side event tracking API
				},
				[]
			)

			const page = useCallback(
				(_name?: string, _properties?: Record<string, unknown>) => {
					// Ahrefs automatically tracks page views via the script
				},
				[]
			)

			const reset = useCallback(() => {
				// Ahrefs doesn't expose a client-side reset API
			}, [])

			return {
				identify,
				track,
				page,
				reset
			}
		}
	}
}
