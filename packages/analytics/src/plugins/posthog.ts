import { default as posthogPlugin } from "@metro-fs/analytics-plugin-posthog";
export { posthogPlugin };
export type PosthogConfig = Parameters<typeof posthogPlugin>[0];
