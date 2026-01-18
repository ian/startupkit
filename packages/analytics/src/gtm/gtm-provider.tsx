"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect } from "react"
import type { AnalyticsPlugin } from "../types"

interface GoogleTagManagerProviderProps {
	children: ReactNode
	containerId?: string
}

/**
 * Google Tag Manager Provider component that injects the GTM container script.
 * Events are pushed to the dataLayer and routed to configured tags in GTM.
 *
 * @param containerId - GTM container ID (GTM-XXXXXXX). Falls back to GTM_CONTAINER_ID or NEXT_PUBLIC_GTM_CONTAINER_ID env vars
 *
 * @see https://developers.google.com/tag-manager
 */
export function GoogleTagManagerProvider({
	children,
	containerId
}: GoogleTagManagerProviderProps) {
	useEffect(() => {
		const GTM_ID =
			containerId ||
			process.env.GTM_CONTAINER_ID ||
			process.env.NEXT_PUBLIC_GTM_CONTAINER_ID

		if (!GTM_ID) return
		if (document.querySelector('script[src*="googletagmanager.com/gtm.js"]'))
			return

		const dataLayer = (window.dataLayer = window.dataLayer || [])
		dataLayer.push({
			"gtm.start": new Date().getTime(),
			event: "gtm.js"
		})

		const script = document.createElement("script")
		script.src = `https://www.googletagmanager.com/gtm.js?id=${GTM_ID}`
		script.async = true
		document.head.appendChild(script)
	}, [containerId])

	return <>{children}</>
}

interface GoogleTagManagerOptions {
	containerId: string
}

/**
 * Google Tag Manager plugin for the AnalyticsProvider.
 * Injects the GTM container script and pushes events to the dataLayer.
 *
 * Events are then routed to configured tags (GA4, Facebook Pixel, etc.) in the GTM dashboard.
 *
 * @example
 * ```tsx
 * import { AnalyticsProvider, GoogleTagManagerPlugin } from "@startupkit/analytics"
 *
 * <AnalyticsProvider plugins={[GoogleTagManagerPlugin({ containerId: "GTM-XXXXXXX" })]}>
 *   {children}
 * </AnalyticsProvider>
 * ```
 *
 * @param options - Configuration options
 * @param options.containerId - GTM container ID (GTM-XXXXXXX)
 *
 * @see https://developers.google.com/tag-manager
 */
export function GoogleTagManagerPlugin(
	options: GoogleTagManagerOptions
): AnalyticsPlugin {
	return {
		name: "GoogleTagManager",
		Provider: ({ children }: { children: ReactNode }) => (
			<GoogleTagManagerProvider containerId={options.containerId}>
				{children}
			</GoogleTagManagerProvider>
		),
		useHandlers: () => {
			const identify = useCallback(
				(userId: string | null, traits?: Record<string, unknown>) => {
					if (typeof window !== "undefined" && window.dataLayer) {
						if (userId) {
							window.dataLayer.push({
								event: "identify",
								user_id: userId,
								...traits
							})
						}
					}
				},
				[]
			)

			const track = useCallback(
				(event: string, properties?: Record<string, unknown>) => {
					if (typeof window !== "undefined" && window.dataLayer) {
						window.dataLayer.push({
							event,
							...properties
						})
					}
				},
				[]
			)

			const page = useCallback(
				(name?: string, properties?: Record<string, unknown>) => {
					if (typeof window !== "undefined" && window.dataLayer) {
						window.dataLayer.push({
							event: "page_view",
							page_title: name || document.title,
							page_path: properties?.pathname || window.location.pathname,
							...properties
						})
					}
				},
				[]
			)

			const reset = useCallback(() => {
				if (typeof window !== "undefined" && window.dataLayer) {
					window.dataLayer.push({
						event: "reset",
						user_id: null
					})
				}
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
