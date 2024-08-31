import { NextConfig } from "next";

type AnalyticsConfig = {
  debug?: boolean;
};

export let config: AnalyticsConfig = {};

const withAnalytics = (
  pluginConfig: AnalyticsConfig,
): ((nextConfig: NextConfig) => NextConfig) => {
  config = pluginConfig;
  return function withAnalytics(nextConfig: NextConfig) {
    return nextConfig;
  };
};

export default withAnalytics;
