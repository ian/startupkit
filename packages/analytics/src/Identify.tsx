"use client";

import React, { useEffect } from "react";
import { useAnalytics } from "./useAnalytics";

type IdentifyProps = {
  children: React.ReactNode;
  id?: string;
  traits?: Record<string, any> | undefined | null;
};

export const Identify = ({ children, id, traits }: IdentifyProps) => {
  const analytics = useAnalytics();

  useEffect(() => {
    if (!id || !analytics) return;

    if (process.env.NODE_ENV === "development") {
      console.debug("[StartupKit] track", id, sanitizeObject(traits));
    }

    analytics?.identify(id, sanitizeObject(traits));
  }, [analytics, id, traits]);

  return <>{children}</>;
};

const sanitizeObject = (
  obj: Record<string, any> | null | undefined,
): Record<string, any> => {
  if (obj === null) {
    return {};
  }
  return JSON.parse(JSON.stringify(obj));
};
