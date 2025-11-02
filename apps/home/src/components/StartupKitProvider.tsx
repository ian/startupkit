"use client"

import {
	AnalyticsProvider,
	GoogleAnalyticsProvider,
	OpenPanelProvider,
	gtag,
	useOpenPanel
} from "@startupkit/analytics"
import type { ReactNode } from "react"

export const StartupKitProvider = ({
	children
}: Readonly<{
	children: ReactNode
}>) => (
	<GoogleAnalyticsProvider>
		<OpenPanelProvider>
			<StartupKitProviderInner>{children}</StartupKitProviderInner>
		</OpenPanelProvider>
	</GoogleAnalyticsProvider>
)

function StartupKitProviderInner({
	children
}: Readonly<{
	children: ReactNode
}>) {
	const openpanel = useOpenPanel()

	return (
		<AnalyticsProvider
			flags={{}}
			handlers={{
				identify: (userId, traits) => {
					if (openpanel) {
						if (userId) {
							openpanel.identify({
								profileId: userId,
								...(traits || {})
							})
						} else {
							openpanel.clear()
						}
					}

					if (userId) {
						gtag("set", { user_id: userId })
						gtag("set", "user_properties", traits || {})
					}
				},
				track: (event, properties) => {
					if (openpanel) {
						openpanel.track(event, properties || {})
					}

					gtag("event", event, properties || {})
				},
				page: (name, properties) => {
					if (openpanel) {
						openpanel.track("$pageview", {
							...(properties || {}),
							...(name ? { route: name } : {})
						})
					}

					gtag("event", "page_view", {
						page_path: properties?.pathname || window.location.pathname,
						page_title: name || document.title,
						...(properties || {})
					})
				},
				reset: () => {
					if (openpanel) {
						openpanel.clear()
					}
				}
			}}
		>
			{children}
		</AnalyticsProvider>
	)
}
