import withAnalytics from "@startupkit/analytics/config";
import withCMS from "@startupkit/cms/config";

/** @type {import('next').NextConfig} */
const baseConfig = {
  env: {
    STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY,
    WORKOS_API_KEY: process.env.WORKOS_API_KEY,
    WORKOS_CLIENT_ID: process.env.WORKOS_CLIENT_ID,
    WORKOS_REDIRECT_URI: process.env.WORKOS_REDIRECT_URI,
  },
};

const combine = (...plugins) => {
  return plugins.reduce((acc, plugin) => plugin(acc), config);
};

module.exports = combine(withAnalytics(), withCMS(), baseConfig);
