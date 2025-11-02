"use client"

import { OpenPanel } from "@openpanel/web"
import { AnalyticsProvider } from "@startupkit/analytics"
import type { ReactNode } from "react"
import { useEffect, useRef } from "react"

const openpanel =
	typeof window !== "undefined"
		? new OpenPanel({
				clientId:
					process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID ||
					process.env.OPENPANEL_CLIENT_ID ||
					"",
				trackScreenViews: false,
				trackOutgoingLinks: true,
				trackAttributes: true
			})
		: null

export const StartupKitProvider = ({
	children
}: Readonly<{
	children: ReactNode
}>) => {
	const initialized = useRef(false)

	useEffect(() => {
		if (!initialized.current && openpanel) {
			initialized.current = true
		}
	}, [])

	return (
		<AnalyticsProvider
			flags={{}}
			handlers={{
				identify: (userId, traits) => {
					if (!openpanel) return
					if (userId) {
						openpanel.identify({
							profileId: userId,
							...(traits || {})
						})
					} else {
						openpanel.clear()
					}
				},
				track: (event, properties) => {
					if (!openpanel) return
					openpanel.track(event, properties || {})
				},
				page: (name, properties) => {
					if (!openpanel) return
					openpanel.track("$pageview", {
						...(properties || {}),
						...(name ? { route: name } : {})
					})
				},
				reset: () => {
					if (!openpanel) return
					openpanel.clear()
				}
			}}
		>
			{children}
		</AnalyticsProvider>
	)
}
