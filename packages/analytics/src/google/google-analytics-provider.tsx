"use client"

import type { ReactNode } from "react"
import { useCallback, useEffect } from "react"
import type { AnalyticsPlugin } from "../types"

declare global {
	interface Window {
		dataLayer?: unknown[]
		gtag?: (...args: unknown[]) => void
	}
}

export function gtag(...args: unknown[]) {
	if (typeof window !== "undefined") {
		window.dataLayer = window.dataLayer || []
		window.dataLayer.push(args)
	}
}

interface GoogleAnalyticsProviderProps {
	children: ReactNode
	measurementId?: string
}

export function GoogleAnalyticsProvider({
	children,
	measurementId
}: GoogleAnalyticsProviderProps) {
	useEffect(() => {
		const GA_ID =
			measurementId ||
			process.env.GOOGLE_ANALYTICS_ID ||
			process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID

		if (GA_ID && !document.querySelector('script[src*="googletagmanager"]')) {
			const script = document.createElement("script")
			script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`
			script.async = true
			document.head.appendChild(script)

			script.onload = () => {
				gtag("js", new Date())
				gtag("config", GA_ID, {
					page_path: window.location.pathname
				})
			}
		}
	}, [measurementId])

	return <>{children}</>
}

interface GoogleAnalyticsOptions {
	measurementId: string
}

export function GoogleAnalyticsPlugin(
	options: GoogleAnalyticsOptions
): AnalyticsPlugin {
	return {
		name: "GoogleAnalytics",
		Provider: ({ children }: { children: ReactNode }) => (
			<GoogleAnalyticsProvider measurementId={options.measurementId}>
				{children}
			</GoogleAnalyticsProvider>
		),
		useHandlers: () => {
			const identify = useCallback(
				(userId: string | null, traits?: Record<string, unknown>) => {
					if (userId) {
						gtag("set", { user_id: userId })
						gtag("set", "user_properties", traits || {})
					}
				},
				[]
			)

			const track = useCallback(
				(event: string, properties?: Record<string, unknown>) => {
					gtag("event", event, properties || {})
				},
				[]
			)

			const page = useCallback(
				(name?: string, properties?: Record<string, unknown>) => {
					gtag("event", "page_view", {
						page_path: properties?.pathname || window.location.pathname,
						page_title: name || document.title,
						...(properties || {})
					})
				},
				[]
			)

			const reset = useCallback(() => {
				// Google Analytics doesn't have a reset method
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
