import { Check, Copy } from "lucide-react"
import { useState } from "react"
import { Button } from "./ui/button"

export function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		try {
			await navigator.clipboard.writeText(text)
			setCopied(true)
			setTimeout(() => setCopied(false), 2000)
		} catch {
			console.error("Failed to copy to clipboard")
		}
	}

	return (
		<Button
			onClick={handleCopy}
			className={`w-28 px-6 py-4 h-auto rounded-xl text-base font-medium transition-all border-0 ${
				copied
					? "bg-emerald-500 hover:bg-emerald-500 text-white"
					: "bg-brand hover:bg-brand-hover text-white"
			}`}
		>
			{copied ? (
				<span className="flex items-center justify-center gap-2">
					<Check className="w-4 h-4" />
					Copied!
				</span>
			) : (
				<span className="flex items-center justify-center gap-2">
					<Copy className="w-4 h-4" />
					Copy
				</span>
			)}
		</Button>
	)
}
