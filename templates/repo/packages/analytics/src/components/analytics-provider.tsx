'use client';

import { pruneEmpty } from '@repo/utils';
import {
  AnalyticsProvider as StartupKitAnalyticsProvider,
  type AnalyticsHandlers,
} from '@startupkit/analytics';
import { PostHogProvider, usePostHog } from 'posthog-js/react';
import type { ReactNode } from 'react';
import { useEffect, useMemo } from 'react';
import { OpenPanelProvider, useOpenPanel } from '../openpanel';
import type { Flags } from '../types';

export {
  AnalyticsContext,
  type AnalyticsContextType,
} from '@startupkit/analytics';

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

function gtag(...args: unknown[]) {
  if (typeof window !== 'undefined') {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(args);
  }
}

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
  );
}

function AnalyticsProviderInner({ children, flags }: AnalyticsProviderProps) {
  const posthog = usePostHog();
  const openpanel = useOpenPanel();

  useEffect(() => {
    const GA_ID = process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID;
    if (GA_ID && !document.querySelector('script[src*="googletagmanager"]')) {
      const script = document.createElement('script');
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
      script.async = true;
      document.head.appendChild(script);

      script.onload = () => {
        gtag('js', new Date());
        gtag('config', GA_ID, {
          page_path: window.location.pathname,
        });
      };
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
