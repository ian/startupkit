import { Check } from "lucide-react"

const aiTools = [
	{
		name: "Devin",
		href: "https://devin.ai",
		logo: "/images/devin-logo.png",
		logoClass: "h-10 w-auto object-contain"
	},
	{
		name: "Claude",
		href: "https://claude.ai",
		logo: "/images/claude-logo.png",
		logoClass: "h-6 w-auto object-contain brightness-0 invert"
	},
	{
		name: "Amp",
		href: "https://ampcode.com",
		logo: "/images/amp-logo.png",
		logoClass: "h-8 w-auto object-contain brightness-0 invert"
	},
	{
		name: "OpenCode",
		href: "https://opencode.ai",
		logo: "/images/opencode-logo.png",
		logoClass: "h-6 w-auto object-contain"
	}
]

export function AIReadySection() {
	return (
		<div className="mt-24 text-center">
			<p className="text-zinc-500 text-sm font-medium mb-8">
				Designed for the new era of development
			</p>
			<div className="flex items-center justify-center gap-16 flex-wrap">
				{aiTools.map((tool) => (
					<a
						key={tool.name}
						href={tool.href}
						target="_blank"
						rel="noopener noreferrer"
						className="flex items-center gap-3 hover:opacity-80 transition-opacity"
					>
						<img
							src={tool.logo}
							alt={tool.name}
							className={tool.logoClass}
						/>
						<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
							<Check className="w-4 h-4 text-emerald-500" />
							Ready
						</span>
					</a>
				))}
			</div>
		</div>
	)
}
