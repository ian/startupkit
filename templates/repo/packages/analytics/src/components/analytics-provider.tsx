'use client';

import { pruneEmpty } from '@repo/utils';
import {
  GoogleAnalyticsProvider,
  gtag,
  OpenPanelProvider,
  AnalyticsProvider as StartupKitAnalyticsProvider,
  useOpenPanel,
  type AnalyticsHandlers,
} from '@startupkit/analytics';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import type { ReactNode } from 'react';
import { useMemo } from 'react';
import type { Flags } from '../types';

export {
  AnalyticsContext,
  type AnalyticsContextType,
} from '@startupkit/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
  flags: Flags;
}

/**
 * Analytics Provider - Multi-provider integration with PostHog, OpenPanel, and Google Analytics
 *
 * Uses @startupkit/analytics for context pattern and auto page tracking.
 * Events are sent to PostHog, OpenPanel, and Google Analytics (if configured) simultaneously.
 */
export function AnalyticsProvider({ children, flags }: AnalyticsProviderProps) {
  return (
    <GoogleAnalyticsProvider>
      <OpenPanelProvider>
        <PostHogProvider
          apiKey={process.env.POSTHOG_API_KEY as string}
          options={{
            api_host: process.env.POSTHOG_HOST,
          }}
        >
          <AnalyticsProviderInner flags={flags}>
            {children}
          </AnalyticsProviderInner>
        </PostHogProvider>
      </OpenPanelProvider>
    </GoogleAnalyticsProvider>
  );
}

function AnalyticsProviderInner({ children, flags }: AnalyticsProviderProps) {
  const posthog = usePostHog();
  const openpanel = useOpenPanel();

  const handlers = useMemo<AnalyticsHandlers>(
    () => ({
      identify: (userId, traits) => {
        if (userId) {
          posthog.identify(userId, pruneEmpty(traits));
          openpanel?.identify({
            profileId: userId,
            ...pruneEmpty(traits),
          });
          gtag('set', { user_id: userId });
          gtag('set', 'user_properties', pruneEmpty(traits) || {});
        } else {
          posthog.reset();
          openpanel?.clear();
        }
      },
      track: (event, properties) => {
        const cleanProps = pruneEmpty(properties);
        posthog.capture(event, cleanProps);
        openpanel?.track(event, cleanProps || {});
        gtag('event', event, cleanProps || {});
      },
      page: (name, properties) => {
        const cleanProps = pruneEmpty(properties);
        posthog.capture('$pageview', {
          ...cleanProps,
          ...(name ? { route: name } : {}),
        });
        openpanel?.track('$pageview', {
          ...(cleanProps || {}),
          ...(name ? { route: name } : {}),
        });
        gtag('event', 'page_view', {
          page_path: properties?.pathname || window.location.pathname,
          page_title: name || document.title,
          ...(cleanProps || {}),
        });
      },
      reset: () => {
        posthog.reset();
        openpanel?.clear();
      },
    }),
    [posthog, openpanel],
  );

  return (
    <StartupKitAnalyticsProvider flags={flags} handlers={handlers}>
      {children}
    </StartupKitAnalyticsProvider>
  );
}
