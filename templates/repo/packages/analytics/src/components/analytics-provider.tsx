'use client';

import { OpenPanel } from '@openpanel/web';
import { pruneEmpty } from '@repo/utils';
import {
  AnalyticsProvider as StartupKitAnalyticsProvider,
  type AnalyticsHandlers,
} from '@startupkit/analytics';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import type { ReactNode } from 'react';
import { useEffect, useMemo, useRef } from 'react';
import type { Flags } from '../types';

export {
  AnalyticsContext,
  type AnalyticsContextType,
} from '@startupkit/analytics';

interface AnalyticsProviderProps {
  children: ReactNode;
  flags: Flags;
}

const openpanel =
  typeof window !== 'undefined'
    ? new OpenPanel({
        clientId:
          process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID ||
          process.env.OPENPANEL_CLIENT_ID ||
          '',
        trackScreenViews: false,
        trackOutgoingLinks: true,
        trackAttributes: true,
      })
    : null;

/**
 * Analytics Provider - Multi-provider integration with PostHog and OpenPanel
 *
 * Uses @startupkit/analytics for context pattern and auto page tracking.
 * Events are sent to both PostHog and OpenPanel simultaneously.
 */
export function AnalyticsProvider({ children, flags }: AnalyticsProviderProps) {
  return (
    <PostHogProvider
      apiKey={process.env.POSTHOG_API_KEY as string}
      options={{
        api_host: process.env.POSTHOG_HOST,
      }}
    >
      <AnalyticsProviderInner flags={flags}>{children}</AnalyticsProviderInner>
    </PostHogProvider>
  );
}

function AnalyticsProviderInner({ children, flags }: AnalyticsProviderProps) {
  const posthog = usePostHog();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && openpanel) {
      initialized.current = true;
    }
  }, []);

  const handlers = useMemo<AnalyticsHandlers>(
    () => ({
      identify: (userId, traits) => {
        if (userId) {
          posthog.identify(userId, pruneEmpty(traits));
          openpanel?.identify({
            profileId: userId,
            ...pruneEmpty(traits),
          });
        } else {
          posthog.reset();
          openpanel?.clear();
        }
      },
      track: (event, properties) => {
        const cleanProps = pruneEmpty(properties);
        posthog.capture(event, cleanProps);
        openpanel?.track(event, cleanProps || {});
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
      },
      reset: () => {
        posthog.reset();
        openpanel?.clear();
      },
    }),
    [posthog],
  );

  return (
    <StartupKitAnalyticsProvider flags={flags} handlers={handlers}>
      {children}
    </StartupKitAnalyticsProvider>
  );
}
