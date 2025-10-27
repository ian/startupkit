/**
 * Gets the absolute URL by combining the base URL with the provided path
 * @param path The path to append to the base URL
 * @returns The complete URL
 */
export function getURL(path: string): string {
	const baseURL = process.env.NEXT_PUBLIC_URL || process.env.VERCEL_URL || ""
	return `${baseURL}${path}`
}
