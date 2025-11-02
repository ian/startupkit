'use client';

import { OpenPanel } from '@openpanel/web';
import {
  AnalyticsProvider,
  GoogleAnalyticsProvider,
  gtag,
} from '@startupkit/analytics';
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
  }, []);

  return (
    <GoogleAnalyticsProvider>
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
    </GoogleAnalyticsProvider>
  );
};
