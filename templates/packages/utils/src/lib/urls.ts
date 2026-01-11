/**
 * Constructs an absolute URL for the given path, automatically detecting the
 * deployment platform and using the appropriate base URL.
 *
 * @param path - The path to append to the base URL (leading slashes are trimmed)
 * @returns The full absolute URL
 *
 * @example
 * ```ts
 * getUrl("/api/auth") // => "https://myapp.vercel.app/api/auth"
 * getUrl("dashboard")  // => "https://myapp.vercel.app/dashboard"
 * getUrl()             // => "https://myapp.vercel.app/"
 * ```
 */
export function getUrl(path = "") {
	const trimmedPath = path.replace(/^\/+/, "")
	const baseUrl = getBaseUrl()
	return `${baseUrl}/${trimmedPath}`
}

/**
 * Detects the deployment platform and returns the appropriate base URL.
 *
 * Supports the following platforms (checked in order):
 * - **Vercel** - Uses `VERCEL_URL`
 * - **Railway** - Uses `RAILWAY_PUBLIC_DOMAIN`
 * - **Render** - Uses `RENDER_EXTERNAL_URL`
 * - **Cloudflare Pages** - Uses `CF_PAGES_URL`
 * - **Fly.io** - Uses `FLY_APP_NAME` to construct `https://{name}.fly.dev`
 *
 * Falls back to `http://localhost:{PORT}` for local development.
 *
 * @returns The base URL without a trailing slash
 */
function getBaseUrl() {
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}`
	}

	if (process.env.RAILWAY_PUBLIC_DOMAIN) {
		return `https://${process.env.RAILWAY_PUBLIC_DOMAIN}`
	}

	if (process.env.RENDER_EXTERNAL_URL) {
		return process.env.RENDER_EXTERNAL_URL
	}

	if (process.env.CF_PAGES_URL) {
		return process.env.CF_PAGES_URL
	}

	if (process.env.FLY_APP_NAME) {
		return `https://${process.env.FLY_APP_NAME}.fly.dev`
	}

	return `http://localhost:${process.env.PORT ?? 3000}`
}
