import { NextConfig } from "next";

type AnalyticsConfig = {
  debug?: boolean;
};

let config: AnalyticsConfig = {};

export const withAnalytics = (
  pluginConfig: AnalyticsConfig,
): ((nextConfig: NextConfig) => NextConfig) => {
  config = pluginConfig;
  return function withAnalytics(nextConfig: NextConfig) {
    return nextConfig;
  };
};

export default withAnalytics;
