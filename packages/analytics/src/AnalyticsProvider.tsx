"use client";

import { usePathname } from "next/navigation";
import React, { createContext, useEffect, useMemo } from "react";
import type { AnalyticsInstance, AnalyticsPlugin } from "./types";

export const AnalyticsContext = createContext<AnalyticsInstance | undefined>(
  undefined
);

interface AnalyticsProviderProps {
  children: React.ReactNode;
  plugins: AnalyticsPlugin[];
}

/**
 * Analytics Provider - Minimal orchestration for multiple analytics providers
 * 
 * Usage:
 * ```tsx
 * import { AnalyticsProvider } from "@startupkit/analytics";
 * import { posthogPlugin, rudderstackPlugin } from "@repo/analytics/plugins";
 * 
 * <AnalyticsProvider plugins={[posthogPlugin, rudderstackPlugin]}>
 *   {children}
 * </AnalyticsProvider>
 * ```
 */
export function AnalyticsProvider({ children, plugins }: AnalyticsProviderProps) {
  const pathname = usePathname();

  const analytics = useMemo<AnalyticsInstance>(() => {
    // Initialize all plugins
    plugins.forEach((plugin) => {
      if (plugin.initialize) {
        plugin.initialize();
      }
    });

    return {
      page: (path: string, properties?: Record<string, unknown>) => {
        plugins.forEach((plugin) => {
          if (plugin.page) {
            plugin.page(path, properties);
          }
        });
      },

      track: (event: string, properties?: Record<string, unknown>) => {
        plugins.forEach((plugin) => {
          if (plugin.track) {
            plugin.track(event, properties);
          }
        });
      },

      identify: (userId: string, traits?: Record<string, unknown>) => {
        plugins.forEach((plugin) => {
          if (plugin.identify) {
            plugin.identify(userId, traits);
          }
        });
      },
    };
  }, [plugins]);

  // Auto-track page views
  useEffect(() => {
    if (pathname) {
      analytics.page(pathname);
    }
  }, [analytics, pathname]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
}
