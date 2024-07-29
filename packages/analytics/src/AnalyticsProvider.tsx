"use client";

import React, { useEffect, useMemo } from "react";
import { usePathname } from "next/navigation";
import { Analytics } from "analytics";

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

  return <>{children}</>;
};
