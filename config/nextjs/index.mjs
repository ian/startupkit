/**
 * Shared Next.js configuration for all apps in the monorepo
 * Handles pnpm strict isolation by ensuring Turbopack compatibility
 */
export function withMonorepoConfig(config = {}) {
  return {
    ...config,
    turbopack: config.turbopack || {},
  };
}
