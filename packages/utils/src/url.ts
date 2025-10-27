export const getURL = (path = "") => {
	let url = "http://localhost:3000/"

	if (process.env.NEXT_PUBLIC_SITE_URL?.trim()) {
		url = process.env.NEXT_PUBLIC_SITE_URL
	} else if (process.env.NEXT_PUBLIC_VERCEL_URL?.trim()) {
		url = process.env.NEXT_PUBLIC_VERCEL_URL
	}

	// Trim the URL and remove trailing slash if exists.
	url = url.replace(/\/+$/, "")
	// Make sure to include `https://` when not localhost.
	url = url.includes("http") ? url : `https://${url}`
	// Ensure path starts without a slash to avoid double slashes in the final URL.
	const _path = path.replace(/^\/+/, "")

	// Concatenate the URL and the path.
	return _path ? `${url}/${_path}` : url
}

const toastKeyMap: Record<string, string[]> = {
	status: ["status", "status_description"],
	error: ["error", "error_description"]
}

const getToastRedirect = (
	path: string,
	toastType: string,
	toastName: string,
	toastDescription = "",
	disableButton = false,
	arbitraryParams = ""
): string => {
	const [nameKey, descriptionKey] = toastKeyMap[toastType]

	let redirectPath = `${path}?${nameKey}=${encodeURIComponent(toastName)}`

	if (toastDescription) {
		redirectPath += `&${descriptionKey}=${encodeURIComponent(toastDescription)}`
	}

	if (disableButton) {
		redirectPath += "&disable_button=true"
	}

	if (arbitraryParams) {
		redirectPath += `&${arbitraryParams}`
	}

	return redirectPath
}

export const getStatusRedirect = (
	path: string,
	statusName: string,
	statusDescription = "",
	disableButton = false,
	arbitraryParams = ""
) =>
	getToastRedirect(
		path,
		"status",
		statusName,
		statusDescription,
		disableButton,
		arbitraryParams
	)

export const getErrorRedirect = (
	path: string,
	errorName: string,
	errorDescription = "",
	disableButton = false,
	arbitraryParams = ""
) =>
	getToastRedirect(
		path,
		"error",
		errorName,
		errorDescription,
		disableButton,
		arbitraryParams
	)
