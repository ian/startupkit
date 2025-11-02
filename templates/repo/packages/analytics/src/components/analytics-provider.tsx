'use client';

import type {
  AnalyticsPlugin,
  AnalyticsContextType as BaseAnalyticsContextType,
} from '@startupkit/analytics';
import {
  GoogleAnalytics,
  OpenPanelPlugin,
  PostHogPlugin,
  AnalyticsProvider as StartupKitAnalyticsProvider,
  useAnalytics as useBaseAnalytics,
} from '@startupkit/analytics';
import type { ReactNode } from 'react';
import type { AnalyticsEvent, Flags } from '../types';

export type AnalyticsContextType = BaseAnalyticsContextType<
  Flags,
  AnalyticsEvent
>;

export function useAnalytics(): AnalyticsContextType {
  return useBaseAnalytics() as AnalyticsContextType;
}

interface AnalyticsProviderProps {
  children: ReactNode;
  flags: Flags;
}

/**
 * Analytics Provider - Multi-provider integration with PostHog, OpenPanel, and Google Analytics
 *
 * Uses @startupkit/analytics plugin architecture for clean, composable analytics integration.
 * Events are sent to PostHog, OpenPanel, and Google Analytics (if configured) simultaneously.
 */
const plugins: AnalyticsPlugin<AnalyticsEvent>[] = [
  GoogleAnalytics({
    measurementId: process.env.GOOGLE_ANALYTICS_ID as string,
  }),
  OpenPanelPlugin({
    clientId: process.env.OPENPANEL_CLIENT_ID as string,
  }),
  PostHogPlugin({
    apiKey: process.env.POSTHOG_API_KEY as string,
    apiHost: process.env.POSTHOG_HOST,
  }),
];

export function AnalyticsProvider({ children, flags }: AnalyticsProviderProps) {
  return (
    <StartupKitAnalyticsProvider flags={flags} plugins={plugins}>
      {children}
    </StartupKitAnalyticsProvider>
  );
}
