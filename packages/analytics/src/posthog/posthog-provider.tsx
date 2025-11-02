"use client"

import type { PostHog } from "posthog-js"
import {
	PostHogProvider as PostHogBaseProvider,
	usePostHog
} from "posthog-js/react"
import React, { type ReactNode, useCallback } from "react"
import type { AnalyticsPlugin } from "../types"

export { usePostHog }

interface PostHogProviderProps {
	children: ReactNode
	apiKey?: string
	apiHost?: string
}

export function PostHogProvider({
	children,
	apiKey,
	apiHost
}: PostHogProviderProps) {
	const key =
		apiKey || process.env.POSTHOG_API_KEY || process.env.NEXT_PUBLIC_POSTHOG_KEY

	const host =
		apiHost || process.env.POSTHOG_HOST || process.env.NEXT_PUBLIC_POSTHOG_HOST

	if (!key) {
		return children
	}

	return (
		<PostHogBaseProvider
			apiKey={key}
			options={{
				api_host: host
			}}
		>
			{/* @ts-ignore - PostHog uses React 18 types, incompatible with React 19 */}
			{children}
		</PostHogBaseProvider>
	)
}

interface PostHogPluginOptions {
	apiKey: string
	apiHost?: string
}

function pruneEmpty(
	obj: Record<string, unknown> | undefined
): Record<string, unknown> | undefined {
	if (!obj) return undefined

	const result: Record<string, unknown> = {}
	for (const [key, value] of Object.entries(obj)) {
		if (
			value !== undefined &&
			value !== null &&
			value !== "" &&
			!(typeof value === "object" && Object.keys(value).length === 0)
		) {
			result[key] = value
		}
	}

	return Object.keys(result).length > 0 ? result : undefined
}

export function PostHogPlugin<TEvent = Record<string, unknown>>(options: PostHogPluginOptions): AnalyticsPlugin<TEvent> {
	return {
		name: "PostHog",
		Provider: ({ children }: { children: ReactNode }) => (
			<PostHogProvider apiKey={options.apiKey} apiHost={options.apiHost}>
				{children}
			</PostHogProvider>
		),
		useHandlers: () => {
			const posthog: PostHog = usePostHog()

			const identify = useCallback(
				(userId: string | null, traits?: Record<string, unknown>) => {
					if (userId) {
						posthog.identify(userId, pruneEmpty(traits))
					} else {
						posthog.reset()
					}
				},
				[posthog]
			)

			const track = useCallback(
				(event: TEvent) => {
					const eventObj = event as Record<string, unknown>
					const eventName = eventObj.event as string
					const { event: _, ...properties } = eventObj
					posthog.capture(eventName, pruneEmpty(properties))
				},
				[posthog]
			)

			const page = useCallback(
				(name?: string, properties?: Record<string, unknown>) => {
					const cleanProps = pruneEmpty(properties)
					posthog.capture("$pageview", {
						...cleanProps,
						...(name ? { route: name } : {})
					})
				},
				[posthog]
			)

			const reset = useCallback(() => {
				posthog.reset()
			}, [posthog])

			return {
				identify,
				track,
				page,
				reset
			}
		}
	}
}
