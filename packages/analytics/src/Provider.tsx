"use client";

import React, { createContext, useEffect, useState } from "react";
import { RudderAnalytics } from "@rudderstack/analytics-js";
import { usePathname } from "next/navigation";

const DEFAULT_DATA_PLANE =
  process.env.RUDDERSTACK_DATA_PLANE ||
  process.env.NEXT_PUBLIC_RUDDERSTACK_DATA_PLANE;

const DEFAULT_WRITE_KEY =
  process.env.RUDDERSTACK_WRITE_KEY ||
  process.env.NEXT_PUBLIC_RUDDERSTACK_WRITE_KEY;

export const AnalyticsContext = createContext<RudderAnalytics | undefined>(
  undefined,
);

export const AnalyticsProvider = ({
  children,
  dataPlane = DEFAULT_DATA_PLANE,
  writeKey = DEFAULT_WRITE_KEY,
}: {
  children: React.ReactNode;
  dataPlane?: string;
  writeKey?: string;
}) => {
  const pathname = usePathname();
  const [analytics, setAnalytics] = useState<RudderAnalytics>();

  useEffect(() => {
    if (!analytics) {
      if (!dataPlane || !writeKey) {
        throw new Error(
          "Missing Rudderstack env vars, please set RUDDERSTACK_WRITE_KEY and RUDDERSTACK_DATA_PLANE",
        );
      }
      const analyticsInstance = new RudderAnalytics();
      analyticsInstance.load(writeKey, dataPlane);
      analyticsInstance.ready(() => {
        if (process.env.NODE_ENV === "development") {
          console.debug("Startupkit Analytics Loaded");
        }
      });

      setAnalytics(analyticsInstance);
    }
  }, [analytics, dataPlane, writeKey]);

  useEffect(() => {
    if (!analytics) return;
    analytics.page(pathname);
  }, [analytics, pathname]);

  return (
    <AnalyticsContext.Provider value={analytics}>
      {children}
    </AnalyticsContext.Provider>
  );
};
