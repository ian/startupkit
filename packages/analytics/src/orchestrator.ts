import type { AnalyticsInstance, AnalyticsPlugin } from "./types";

/**
 * Creates an analytics orchestrator that coordinates multiple providers
 * This is useful when you want to send events to multiple analytics services
 */
export function createAnalyticsOrchestrator(
    plugins: AnalyticsPlugin[]
): AnalyticsInstance {
    // Initialize all plugins
    plugins.forEach(plugin => {
        if (plugin.initialize) {
            plugin.initialize();
        }
    });

    return {
        page: (path: string, properties?: Record<string, unknown>) => {
            plugins.forEach(plugin => {
                if (plugin.page) {
                    plugin.page(path, properties);
                }
            });
        },

        track: (event: string, properties?: Record<string, unknown>) => {
            plugins.forEach(plugin => {
                if (plugin.track) {
                    plugin.track(event, properties);
                }
            });
        },

        identify: (userId: string, traits?: Record<string, unknown>) => {
            plugins.forEach(plugin => {
                if (plugin.identify) {
                    plugin.identify(userId, traits);
                }
            });
        },
    };
}

