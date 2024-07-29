"use client";

import React, { createContext, useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Analytics, AnalyticsInstance } from "analytics";

export const AnalyticsContext = createContext<AnalyticsInstance | undefined>(
  undefined
);

export const AnalyticsProvider = ({
  children,
  plugins,
}: {
  children: React.ReactNode;
  plugins: any[];
}) => {
  const analytics = useMemo(() => {
    return Analytics({
      // version: 100,
      plugins,
    });
  }, [plugins]);

  const pathname = usePathname();

  useEffect(() => {
    analytics.page({ path: pathname });
  }, [analytics, pathname]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};
