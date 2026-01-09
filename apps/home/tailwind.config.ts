import type { Config } from "tailwindcss"
import animate from "tailwindcss-animate"

const config: Config = {
	darkMode: "class",
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
				brand: {
					DEFAULT: "#4B4DF5",
					hover: "#3b3dd5"
				}
			},
			fontFamily: {
				sans: ["Inter Variable", "Inter", "system-ui", "sans-serif"],
				mono: ["ui-monospace", "SFMono-Regular", "monospace"]
			},
			keyframes: {
				"accordion-down": {
					from: { height: "0" },
					to: { height: "var(--radix-accordion-content-height)" }
				},
				"accordion-up": {
					from: { height: "var(--radix-accordion-content-height)" },
					to: { height: "0" }
				}
			},
			animation: {
				"accordion-down": "accordion-down 0.2s ease-out",
				"accordion-up": "accordion-up 0.2s ease-out"
			}
		}
	},
	plugins: [animate]
}

export default config
