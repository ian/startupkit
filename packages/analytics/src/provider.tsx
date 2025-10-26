"use client"

import { usePathname, useSelectedLayoutSegments } from "next/navigation"
import { PostHogProvider, usePostHog } from "posthog-js/react"
import type { ReactNode } from "react"
import { useEffect, useMemo } from "react"
import { AnalyticsContext } from "./context"

interface AnalyticsProviderConfig<TFlags = Record<string, boolean | string | undefined>> {
  apiKey: string
  apiHost?: string
  flags: TFlags
  pruneEmpty?: (obj: Record<string, unknown> | undefined) => Record<string, unknown>
}

interface AnalyticsProviderProps<TFlags = Record<string, boolean | string | undefined>> {
  children: ReactNode
  config: AnalyticsProviderConfig<TFlags>
}

export function createAnalyticsProvider<TFlags = Record<string, boolean | string | undefined>>() {
  function AnalyticsProvider({ children, config }: AnalyticsProviderProps<TFlags>) {
    return (
      <PostHogProvider
        apiKey={config.apiKey}
        options={{
          api_host: config.apiHost
        }}
      >
        <AnalyticsProviderInner config={config}>{children}</AnalyticsProviderInner>
      </PostHogProvider>
    )
  }

  function AnalyticsProviderInner({ children, config }: AnalyticsProviderProps<TFlags>) {
    const pathname = usePathname()
    const segments = useSelectedLayoutSegments()
    const posthog = usePostHog()

    useEffect(() => {
      const name = segments
        .filter((segment) => !segment.startsWith("("))
        .map((segment) => (/\d/.test(segment) && segment.length > 6 ? ":id" : segment))
        .join("/")

      posthog.capture("$pageview", {
        $current_url: pathname,
        route: `/${name}`
      })
    }, [pathname, segments, posthog])

    const context = useMemo(() => {
      const pruneEmpty = config.pruneEmpty || ((obj) => obj)
      
      return {
        identify: (userId: string | null, properties: Record<string, string | number | boolean | null | undefined> = {}) => {
          if (userId) {
            posthog.identify(userId, pruneEmpty(properties) as Record<string, unknown>)
          } else {
            posthog.reset()
          }
        },
        reset: () => {
          posthog.reset()
        },
        track: (event: string, properties?: Record<string, string | number | boolean | null | undefined>) => {
          posthog.capture(event, pruneEmpty(properties) as Record<string, unknown>)
        },
        flags: config.flags
      }
    }, [config.flags, posthog, config.pruneEmpty])

    return (
      <AnalyticsContext.Provider value={context as never}>
        {children}
      </AnalyticsContext.Provider>
    )
  }

  return AnalyticsProvider
}

