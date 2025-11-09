import type { StartupKitConfig } from "@startupkit/cli/config"

const config: StartupKitConfig = {
	type: "package",
	dependencies: {
		config: ["typescript"],
	},
}

export default config

