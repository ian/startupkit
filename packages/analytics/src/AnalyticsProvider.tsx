"use client";

import React, { createContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { Analytics, AnalyticsInstance, AnalyticsPlugin } from "analytics";
import { AnalyticsPlugins } from "./plugins";

export const AnalyticsContext = createContext<AnalyticsInstance | undefined>(
  undefined,
);

export const AnalyticsProvider = ({
  children,
  plugins,
}: {
  children: React.ReactNode;
  plugins: AnalyticsPlugins;
}) => {
  const pathname = usePathname();
  const [analyticsPlugins, setAnalyticsPlugins] = useState<AnalyticsPlugin[]>();

  // Rebuild the analytics.js plugins config anytime our config object changes
  useEffect(() => {
    (async () => {
      const _plugins = [];

      if (plugins.googleAnalytics) {
        const { googleAnalyticsPlugin } = await import("./plugins/ga");
        _plugins.push(googleAnalyticsPlugin(plugins.googleAnalytics));
      }

      if (plugins.plausible) {
        const { plausiblePlugin } = await import("./plugins/plausible");
        _plugins.push(plausiblePlugin(plugins.plausible));
      }

      if (plugins.posthog) {
        const { posthogPlugin } = await import("./plugins/posthog");
        _plugins.push(posthogPlugin(plugins.posthog));
      }

      setAnalyticsPlugins(_plugins);
    })();
  }, [plugins]);

  const analytics = useMemo(() => {
    if (!analyticsPlugins) return;
    return Analytics({
      // version: 100,
      plugins: analyticsPlugins,
    });
  }, [analyticsPlugins]);

  useEffect(() => {
    if (!analytics || !pathname) return;
    analytics.page({ path: pathname });
  }, [analytics, pathname]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};
