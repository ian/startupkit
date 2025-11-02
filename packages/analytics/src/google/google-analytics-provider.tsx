"use client"

import type { ReactNode } from "react"
import { useEffect } from "react"

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
