'use client';

import {
  Ahrefs,
  AnalyticsProvider,
  GoogleAnalytics,
  OpenPanelPlugin,
} from '@startupkit/analytics';
import type { ReactNode } from 'react';

const plugins = [
  Ahrefs({
    key: process.env.NEXT_PUBLIC_AHREFS_API_KEY as string,
  }),
  GoogleAnalytics({
    measurementId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID as string,
  }),
  OpenPanelPlugin({
    clientId: process.env.NEXT_PUBLIC_OPENPANEL_CLIENT_ID as string,
  }),
];

export function StartupKitProvider({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <AnalyticsProvider flags={{}} plugins={plugins}>
      {children}
    </AnalyticsProvider>
  );
}
