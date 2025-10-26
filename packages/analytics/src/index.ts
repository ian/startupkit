// @startupkit/analytics - Minimal Core
// Provides orchestration utilities for multi-provider analytics
// Use this when you need to coordinate multiple analytics providers

export { AnalyticsProvider } from "./AnalyticsProvider";
export { createAnalyticsOrchestrator } from "./orchestrator";
export type { AnalyticsPlugin, AnalyticsPluginConfig } from "./types";
export { useAnalytics } from "./useAnalytics";
export * from "./utils";

