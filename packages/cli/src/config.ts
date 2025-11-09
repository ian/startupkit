/**
 * Configuration schema for StartupKit templates.
 *
 * Each template (app or package) can include a `startupkit.config.ts` file
 * that declares its dependencies. The CLI reads this to automatically install
 * missing workspace packages before scaffolding.
 *
 * @example
 * ```typescript
 * import type { StartupKitConfig } from "startupkit/config"
 *
 * const config: StartupKitConfig = {
 *   type: "app",
 *   dependencies: {
 *     packages: ["auth", "db", "ui"],
 *     config: ["nextjs", "typescript"]
 *   }
 * }
 *
 * export default config
 * ```
 */
export interface StartupKitConfig {
	/** Template type: "app" for applications, "package" for workspace packages */
	type: "app" | "package"
	/** Optional dependencies required by this template */
	dependencies?: {
		/** Workspace packages (e.g., "auth", "db") - installed to packages/* */
		packages?: string[]
		/** Config packages (e.g., "nextjs", "typescript") - installed to config/* */
		config?: string[]
	}
}

/**
 * Dynamically imports and loads a StartupKit config file.
 *
 * This function is used when templates are already cloned locally and we need
 * to read their configuration. For remote templates, use the regex parsing
 * approach in the add command instead.
 *
 * @param configPath - Absolute or relative path to the config file
 * @returns Parsed config object, or null if file doesn't exist or can't be loaded
 *
 * @example
 * ```typescript
 * const config = await loadConfig("./startupkit.config.ts")
 * if (config?.dependencies?.packages) {
 *   console.log("Required packages:", config.dependencies.packages)
 * }
 * ```
 */
export async function loadConfig(
	configPath: string
): Promise<StartupKitConfig | null> {
	try {
		const { default: config } = await import(configPath)
		return config
	} catch {
		return null
	}
}
