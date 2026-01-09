import { Check } from "lucide-react"

export function AIReadySection() {
	return (
		<div className="mt-24 text-center">
			<p className="text-zinc-500 text-sm font-medium mb-8">
				Designed for the new era of development
			</p>
		<div className="flex items-center justify-center gap-16 flex-wrap">
			<a
				href="https://devin.ai"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-3 hover:opacity-80 transition-opacity"
			>
				<img
					src="/images/devin-logo.png"
					alt="Devin"
					className="h-10 w-auto object-contain"
				/>
				<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
					<Check className="w-4 h-4 text-emerald-500" />
					Ready
				</span>
			</a>
			<a
				href="https://claude.ai"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-3 hover:opacity-80 transition-opacity"
			>
				<img
					src="/images/claude-logo.png"
					alt="Claude"
					className="h-6 w-auto object-contain brightness-0 invert"
				/>
				<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
					<Check className="w-4 h-4 text-emerald-500" />
					Ready
				</span>
			</a>
			<a
				href="https://ampcode.com"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-3 hover:opacity-80 transition-opacity"
			>
				<img
					src="/images/amp-logo.png"
					alt="Amp"
					className="h-8 w-auto object-contain brightness-0 invert"
				/>
				<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
					<Check className="w-4 h-4 text-emerald-500" />
					Ready
				</span>
			</a>
			<a
				href="https://opencode.ai"
				target="_blank"
				rel="noopener noreferrer"
				className="flex items-center gap-3 hover:opacity-80 transition-opacity"
			>
				<img
					src="/images/opencode-logo.png"
					alt="OpenCode"
					className="h-6 w-auto object-contain"
				/>
				<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
					<Check className="w-4 h-4 text-emerald-500" />
					Ready
				</span>
			</a>
		</div>
		</div>
	)
}
