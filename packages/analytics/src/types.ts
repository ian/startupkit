// Core analytics types for orchestration

export interface AnalyticsPlugin {
    name: string;
    initialize?: () => void | Promise<void>;
    page?: (path: string, properties?: Record<string, unknown>) => void | Promise<void>;
    track?: (event: string, properties?: Record<string, unknown>) => void | Promise<void>;
    identify?: (userId: string, traits?: Record<string, unknown>) => void | Promise<void>;
}

export interface AnalyticsPluginConfig {
    plugins: AnalyticsPlugin[];
    enabled?: boolean;
    debug?: boolean;
}

export interface AnalyticsInstance {
    page: (path: string, properties?: Record<string, unknown>) => void;
    track: (event: string, properties?: Record<string, unknown>) => void;
    identify: (userId: string, traits?: Record<string, unknown>) => void;
}

