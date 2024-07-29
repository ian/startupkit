import React, { createContext, useContext } from "react";
import { AnalyticsContext } from "./AnalyticsProvider";

export const useAnalytics = () => {
  const context = useContext(AnalyticsContext);

  if (context === undefined) {
    throw new Error(
      "useAnalytics must be used within an @startupkit/analytics AnalyticsProvider"
    );
  }

  return context;
};
