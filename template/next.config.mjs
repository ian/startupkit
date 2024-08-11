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
  return plugins.reduce((acc, plugin) => plugin(acc), baseConfig);
};

export default combine(
  withAnalytics({
    ga: {
      measurementIds: [process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID],
    },
    plausible: {
      domain: "startupkit.com",
      trackLocalhost: true,
    },
    posthog: {
      token: process.env.NEXT_PUBLIC_POSTHOG_TOKEN,
      enabled: true,
      options: {
        persistence: "memory",
        disable_cookie: true,
      },
    },
  }),
  withCMS({}),
);
