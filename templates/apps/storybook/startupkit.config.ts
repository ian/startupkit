import type { StartupKitConfig } from "startupkit/config"

const config: StartupKitConfig = {
	type: "app",
	dependencies: {
		packages: ["ui", "auth", "emails", "analytics"]
	}
}

export default config
