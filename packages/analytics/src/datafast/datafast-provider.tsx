"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect } from "react"
import type { AnalyticsPlugin } from "../types"

declare global {
	interface Window {
		datafast?: (
			event: string,
			properties?: Record<string, unknown>
		) => void
	}
}

interface DatafastProviderProps {
	children: ReactNode
	websiteId?: string
	domain?: string
}

/**
 * Datafast Analytics Provider component that injects the Datafast analytics script.
 * Automatically tracks page views once the script is loaded.
 *
 * @param websiteId - Datafast website ID (dfid_*). Falls back to DATAFAST_WEBSITE_ID or NEXT_PUBLIC_DATAFAST_WEBSITE_ID env vars
 * @param domain - Your domain for scoping data. Falls back to DATAFAST_DOMAIN or NEXT_PUBLIC_DATAFAST_DOMAIN env vars
 *
 * @see https://datafa.st/docs
 */
export function DatafastProvider({
	children,
	websiteId,
	domain
}: DatafastProviderProps) {
	useEffect(() => {
		const WEBSITE_ID =
			websiteId ||
			process.env.DATAFAST_WEBSITE_ID ||
			process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID

		const DOMAIN =
			domain ||
			process.env.DATAFAST_DOMAIN ||
			process.env.NEXT_PUBLIC_DATAFAST_DOMAIN

		if (WEBSITE_ID && !document.querySelector('script[src*="datafa.st"]')) {
			// Add queue function for events fired before script loads
			if (!window.datafast) {
				const queue: Array<[string, Record<string, unknown>?]> = []
				window.datafast = (
					event: string,
					properties?: Record<string, unknown>
				) => {
					queue.push([event, properties])
				}
				;(window.datafast as unknown as { q: typeof queue }).q = queue
			}

			const script = document.createElement("script")
			script.src = "https://datafa.st/js/script.js"
			script.defer = true
			script.setAttribute("data-website-id", WEBSITE_ID)
			if (DOMAIN) {
				script.setAttribute("data-domain", DOMAIN)
			}
			document.head.appendChild(script)
		}
	}, [websiteId, domain])

	return <>{children}</>
}

interface DatafastOptions {
	websiteId: string
	domain?: string
}

/**
 * Datafast analytics plugin for the AnalyticsProvider.
 * Injects the Datafast analytics script and provides event tracking.
 *
 * @example
 * ```tsx
 * import { AnalyticsProvider, DatafastPlugin } from "@startupkit/analytics"
 *
 * <AnalyticsProvider plugins={[DatafastPlugin({ websiteId: "dfid_..." })]}>
 *   {children}
 * </AnalyticsProvider>
 * ```
 *
 * @param options - Configuration options
 * @param options.websiteId - Datafast website ID (dfid_*)
 * @param options.domain - Optional domain for scoping data
 *
 * @see https://datafa.st/docs
 */
export function DatafastPlugin(options: DatafastOptions): AnalyticsPlugin {
	return {
		name: "Datafast",
		Provider: ({ children }: { children: ReactNode }) => (
			<DatafastProvider websiteId={options.websiteId} domain={options.domain}>
				{children}
			</DatafastProvider>
		),
		useHandlers: () => {
			const identify = useCallback(
				(userId: string | null, traits?: Record<string, unknown>) => {
					if (typeof window !== "undefined" && window.datafast && userId) {
						window.datafast("identify", {
							user_id: userId,
							...traits
						})
					}
				},
				[]
			)

			const track = useCallback(
				(event: string, properties?: Record<string, unknown>) => {
					if (typeof window !== "undefined" && window.datafast) {
						window.datafast(event, properties)
					}
				},
				[]
			)

			const page = useCallback(
				(_name?: string, _properties?: Record<string, unknown>) => {
					// Datafast automatically tracks page views via the script
				},
				[]
			)

			const reset = useCallback(() => {
				// Datafast doesn't expose a client-side reset API
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
