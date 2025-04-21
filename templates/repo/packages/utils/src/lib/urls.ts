export function getUrl(path = "") {
	const trimmedPath = path.replace(/^\/+/, "")

	// If we're here, and the VERCEL_URL is set, we want to use it
	// This really only happens when running locally and .env specifies VERCEL_URL
	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}/${trimmedPath}`
	}

	if (process.env.DEV_SSL) {
		return `https://localhost:${process.env.PORT ?? "3000"}/${trimmedPath}`
	}

	return `http://localhost:${process.env.PORT ?? "3000"}/${trimmedPath}`
}
