import { default as plausiblePlugin } from "analytics-plugin-plausible";
export { plausiblePlugin };
export type PlausibleConfig = Parameters<typeof plausiblePlugin>[0];
