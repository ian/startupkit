export function getUrl(path = "") {
	const trimmedPath = path.replace(/^\/+/, "")

	if (process.env.VERCEL_URL) {
		return `https://${process.env.VERCEL_URL}/${trimmedPath}`
	}

	return `http://localhost:${process.env.PORT ?? 3000}/${trimmedPath}`
}
