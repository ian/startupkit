import { CopyButton } from "./copy-button"
import { TerminalDemo } from "./terminal-demo"

export function HeroSection() {
	return (
		<div className="grid md:grid-cols-2 gap-12 items-center max-w-6xl mx-auto">
			<div className="space-y-8">
				<h1 className="text-6xl font-normal leading-[1.1] tracking-tight text-balance">
					The startup stack for the
					<br />
					<span className="text-zinc-500">AI era.</span>
				</h1>
				<p className="text-lg text-zinc-400 leading-relaxed tracking-normal max-w-lg">
					Built for founders who move fast. Loved by the AI tools that help
					them. Pre-configured auth, analytics, SEO, and database with clear
					patterns your copilot can follow. One command to start.
				</p>
				<div className="flex items-center gap-3 max-w-md">
					<div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 font-mono text-sm text-zinc-300">
						<span className="text-zinc-500 mr-2">{">"}</span>
						<span>npx startupkit init</span>
					</div>
					<CopyButton text="npx startupkit init" />
				</div>
			</div>

			<TerminalDemo />
		</div>
	)
}
