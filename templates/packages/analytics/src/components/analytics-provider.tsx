/**
 * Analytics Provider - Type-safe analytics integration for your application
 *
 * This module provides a fully typed analytics implementation using @startupkit/analytics
 * with support for multiple analytics providers (Google Analytics, PostHog, OpenPanel).
 *
 * Features:
 * - Type-safe event tracking using discriminated unions
 * - Multi-provider support (events sent to all providers simultaneously)
 * - Feature flag integration
 * - Automatic page view tracking
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { AnalyticsProvider } from '@repo/analytics';
 *
 * <AnalyticsProvider flags={flags}>
 *   <App />
 * </AnalyticsProvider>
 * ```
 *
 * @example
 * ```tsx
 * // In your components
 * import { useAnalytics } from '@repo/analytics';
 *
 * function MyComponent() {
 *   const { track, flags } = useAnalytics();
 *
 *   track({
 *     event: "USER_SIGNED_IN",
 *     user: { id: "123", email: "user@example.com" }
 *   });
 * }
 * ```
 */
'use client';

import type {
  AnalyticsContextType,
  AnalyticsPlugin,
} from '@startupkit/analytics';
import {
  AhrefsPlugin,
  DatafastPlugin,
  GoogleAnalyticsPlugin,
  GoogleTagManagerPlugin,
  OpenPanelPlugin,
  PostHogPlugin,
  AnalyticsProvider as StartupKitAnalyticsProvider,
  useAnalytics as useBaseAnalytics,
} from '@startupkit/analytics';
import type { ReactNode } from 'react';
import type { Flags } from '../types';

/**
 * Analytics plugins configuration
 *
 * Configures all analytics providers to receive events simultaneously.
 * Add or remove providers by modifying this array.
 *
 * Providers are initialized with environment variables:
 * - NEXT_PUBLIC_AHREFS_API_KEY - Ahrefs API key
 * - NEXT_PUBLIC_DATAFAST_WEBSITE_ID - Datafast website ID (dfid_*)
 * - NEXT_PUBLIC_DATAFAST_DOMAIN - Datafast domain (optional)
 * - NEXT_PUBLIC_GOOGLE_ANALYTICS_ID - Google Analytics measurement ID
 * - NEXT_PUBLIC_GTM_CONTAINER_ID - Google Tag Manager container ID (GTM-XXXXXXX)
 * - NEXT_PUBLIC_OPENPANEL_CLIENT_ID - OpenPanel client ID
 * - NEXT_PUBLIC_POSTHOG_KEY - PostHog API key
 * - POSTHOG_HOST (optional) - Custom PostHog host URL (defaults to https://app.posthog.com)
 */
const plugins: AnalyticsPlugin[] = [
  AhrefsPlugin({
    key: process.env.NEXT_PUBLIC_AHREFS_API_KEY as string,
  }),
  DatafastPlugin({
    websiteId: process.env.NEXT_PUBLIC_DATAFAST_WEBSITE_ID as string,
    domain: process.env.NEXT_PUBLIC_DATAFAST_DOMAIN,
  }),
  GoogleAnalyticsPlugin({
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string,
  }),
  GoogleTagManagerPlugin({
    containerId: process.env.NEXT_PUBLIC_GTM_CONTAINER_ID as string,
  }),
  OpenPanelPlugin({
    clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID as string,
  }),
  PostHogPlugin({
    apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY as string,
  }),
];

/**
 * Type-safe analytics hook
 *
 * Returns an analytics context with properly typed events and feature flags.
 * All events are validated at compile-time using TypeScript discriminated unions.
 *
 * @returns Analytics context with track, identify, page, reset methods and feature flags
 *
 * @example
 * ```tsx
 * const { track, identify, flags } = useAnalytics();
 *
 * // Type-safe event tracking
 * track({
 *   event: "TEAM_CREATED",
 *   teamId: "team_123"
 * });
 *
 * // Identify users
 * identify("user_123", {
 *   email: "user@example.com",
 *   name: "John Doe"
 * });
 *
 * // Check feature flags
 * if (flags["secret-flag"]) {
 *   // Show secret feature
 * }
 * ```
 */
export function useAnalytics(): AnalyticsContextType<Flags> {
  return useBaseAnalytics();
}
interface AnalyticsProviderProps {
  children: ReactNode;
  flags: Flags;
}

/**
 * Analytics Provider component
 *
 * Wraps your application to provide analytics tracking and feature flags.
 * Should be placed near the root of your component tree.
 *
 * @param children - React children to wrap
 * @param flags - Feature flags object (from PostHog or other feature flag provider)
 *
 * @example
 * ```tsx
 * // In your root layout
 * import { AnalyticsProvider } from '@repo/analytics';
 * import { getFeatureFlags } from '@repo/analytics/server';
 *
 * export default async function RootLayout({ children }) {
 *   const flags = await getFeatureFlags();
 *
 *   return (
 *     <html>
 *       <body>
 *         <AnalyticsProvider flags={flags}>
 *           {children}
 *         </AnalyticsProvider>
 *       </body>
 *     </html>
 *   );
 * }
 * ```
 */
export function AnalyticsProvider({ children, flags }: AnalyticsProviderProps) {
  return (
    <StartupKitAnalyticsProvider flags={flags} plugins={plugins}>
      {children}
    </StartupKitAnalyticsProvider>
  );
}
