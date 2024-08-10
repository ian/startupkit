import { NextConfig } from "next";

type AnalyticsConfig = {
  debug?: boolean;
};

const withAnalytics = (
  pluginConfig: AnalyticsConfig
): ((nextConfig: NextConfig) => NextConfig) => {
  return function withAnalytics(nextConfig: NextConfig) {
    return nextConfig;
  };
};

export default withAnalytics;
