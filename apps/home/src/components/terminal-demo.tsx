import { Check } from "lucide-react"
import { INIT_COMMAND } from "../lib/constants"

function PackageRow({ name, description }: { name: string; description: string }) {
	return (
		<div className="flex items-center gap-3">
			<Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
			<span className="text-cyan-400 min-w-[140px]">{name}</span>
			<span className="text-zinc-500">→</span>
			<span className="text-zinc-400">{description}</span>
		</div>
	)
}

export function TerminalDemo() {
	return (
		<div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden font-mono text-sm">
			<div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
				<div className="w-3 h-3 rounded-full bg-zinc-700" />
				<div className="w-3 h-3 rounded-full bg-zinc-700" />
				<div className="w-3 h-3 rounded-full bg-zinc-700" />
				<span className="ml-2 text-zinc-500 text-xs">~/my-startup</span>
			</div>
			<div className="p-5 space-y-4">
				<div className="text-zinc-400">
					<span className="text-emerald-500">$</span> {INIT_COMMAND}
				</div>
				<div className="text-zinc-500 pt-2">Setting up your monorepo...</div>
				<div className="space-y-3 pt-2">
					<PackageRow name="@repo/auth" description="Better Auth configured" />
					<PackageRow name="@repo/analytics" description="PostHog, GA4 ready" />
					<PackageRow name="@repo/db" description="Drizzle + Postgres" />
					<PackageRow name="@repo/emails" description="React Email templates" />
					<PackageRow name="@repo/seo" description="Meta, OG, sitemap" />
					<PackageRow name="@repo/ui" description="60+ Shadcn components" />
				</div>
				<div className="pt-4 border-t border-zinc-800 mt-4">
					<div className="flex items-center gap-2 text-emerald-500">
						<Check className="w-4 h-4" />
						<span>
							Ready to build. Run <span className="text-white">pnpm dev</span> to
							start.
						</span>
					</div>
				</div>
			</div>
		</div>
	)
}
