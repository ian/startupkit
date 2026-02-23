import type { Preview } from "@storybook/react-vite"
import "./styles.css"
import React from "react"

declare global {
	interface Window {
		process?: { env?: Record<string, string> }
		React?: typeof React
	}
}

if (typeof window !== "undefined") {
	if (typeof window.process === "undefined") {
		window.process = { env: {} }
	}
	if (typeof window.React === "undefined") {
		window.React = React
	}
}

const preview: Preview = {
	parameters: {
		actions: { argTypesRegex: "^on[A-Z].*" },
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/
			}
		},
		options: {
			storySort: {
				order: ["UI", "Auth", "Emails", "Analytics"],
				method: "alphabetical"
			}
		},
		backgrounds: {
			options: {
				light: {
					name: "light",
					value: "#ffffff"
				},

				dark: {
					name: "dark",
					value: "#0a0a0a"
				}
			}
		}
	},

	initialGlobals: {
		backgrounds: {
			value: "light"
		}
	}
}

export default preview
