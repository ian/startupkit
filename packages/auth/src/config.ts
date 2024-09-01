import { NextConfig } from "next";

type AuthConfig = {
  debug?: boolean;
};

let config: AuthConfig = {};

export const withAuth = (
  pluginConfig: AuthConfig
): ((nextConfig: NextConfig) => NextConfig) => {
  config = pluginConfig;
  return function withAuth(nextConfig: NextConfig) {
    return nextConfig;
  };
};
