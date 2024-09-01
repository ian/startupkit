import { NextConfig } from "next";

type PaymentsConfig = {
  debug?: boolean;
};

let config: PaymentsConfig = {};

export const withPayments = (
  pluginConfig: PaymentsConfig
): ((nextConfig: NextConfig) => NextConfig) => {
  config = pluginConfig;
  return function withPayments(nextConfig: NextConfig) {
    return nextConfig;
  };
};
