"use client"

import { useAnalytics } from "@startupkit/analytics"
import { Copy } from "lucide-react"
import toast from "react-hot-toast"

export const CopyCmd = () => {
	const { track } = useAnalytics()
	const text = "npx startupkit@latest"

	const copyToClipboard = async () => {
		try {
			await navigator.clipboard.writeText(text)
			track("Homepage:CopytoClipboard")
			toast.success("Copied to clipboard!")
		} catch (err) {}
	}

	return (
		<button
			type="button"
			className="flex items-center gap-2 px-4 py-2 font-mono text-white rounded-full bg-blue-900/50 cursor-pointer hover:bg-blue/40 transition-all duration-300"
			onClick={copyToClipboard}
		>
			$ npx startupkit@latest
			<Copy size={16} />
		</button>
	)
}
