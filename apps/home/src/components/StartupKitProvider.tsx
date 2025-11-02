'use client';

import { OpenPanel } from '@openpanel/web';
import { AnalyticsProvider } from '@startupkit/analytics';
import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

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

export const StartupKitProvider = ({
  children,
}: Readonly<{
  children: ReactNode;
}>) => {
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current && openpanel) {
      initialized.current = true;
    }

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

  return (
    <AnalyticsProvider
      flags={{}}
      handlers={{
        identify: (userId, traits) => {
          if (openpanel) {
            if (userId) {
              openpanel.identify({
                profileId: userId,
                ...(traits || {}),
              });
            } else {
              openpanel.clear();
            }
          }

          if (userId) {
            gtag('set', { user_id: userId });
            gtag('set', 'user_properties', traits || {});
          }
        },
        track: (event, properties) => {
          if (openpanel) {
            openpanel.track(event, properties || {});
          }

          gtag('event', event, properties || {});
        },
        page: (name, properties) => {
          if (openpanel) {
            openpanel.track('$pageview', {
              ...(properties || {}),
              ...(name ? { route: name } : {}),
            });
          }

          gtag('event', 'page_view', {
            page_path: properties?.pathname || window.location.pathname,
            page_title: name || document.title,
            ...(properties || {}),
          });
        },
        reset: () => {
          if (openpanel) {
            openpanel.clear();
          }
        },
      }}
    >
      {children}
    </AnalyticsProvider>
  );
};
