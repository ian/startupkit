import type { Config } from "tailwindcss"

const config: Config = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			fontFamily: {
				sans: ["Inter", "system-ui", "sans-serif"],
				mono: ["ui-monospace", "SFMono-Regular", "monospace"]
			}
		}
	},
	plugins: []
}

export default config
