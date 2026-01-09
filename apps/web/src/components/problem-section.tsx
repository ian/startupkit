import { Check } from "lucide-react"

export function ProblemSection() {
	return (
		<section className="my-48 max-w-6xl mx-auto">
			<div className="text-center mb-16">
				<h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-6 text-balance">
					AI needs constraints to be useful.
				</h2>
				<p className="text-lg text-zinc-400 max-w-2xl mx-auto">
					Without structure, every project becomes a different architecture.
					That's <span className="text-white font-medium">AI slop</span>.
				</p>
			</div>

			<div className="grid md:grid-cols-2 gap-6">
				{/* Without StartupKit */}
				<div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
					<div className="relative">
						<div className="flex items-center gap-2 text-red-400/80 mb-6">
							<div className="w-2 h-2 rounded-full bg-red-400/80" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								WITHOUT STARTUPKIT
							</span>
						</div>
						<div className="space-y-4 font-mono text-sm">
							<div className="flex items-start gap-3">
								<span className="text-zinc-600 mt-0.5">?</span>
								<span className="text-zinc-500">
									Where should auth logic live?
								</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-zinc-600 mt-0.5">?</span>
								<span className="text-zinc-500">
									Prisma or Drizzle? Which pattern?
								</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-zinc-600 mt-0.5">?</span>
								<span className="text-zinc-500">
									App router or pages? RSC or client?
								</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-zinc-600 mt-0.5">?</span>
								<span className="text-zinc-500">
									How do I structure shared code?
								</span>
							</div>
							<div className="flex items-start gap-3">
								<span className="text-zinc-600 mt-0.5">?</span>
								<span className="text-zinc-500">
									Which analytics provider? How to abstract?
								</span>
							</div>
						</div>
						<div className="mt-8 pt-6 border-t border-zinc-800">
							<p className="text-zinc-500 text-sm">
								Burn tokens reinventing the wheel. Every project starts from
								zero.
							</p>
						</div>
					</div>
				</div>

				{/* With StartupKit */}
				<div className="relative bg-zinc-900/50 border border-zinc-800 rounded-2xl p-8 overflow-hidden">
					<div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent pointer-events-none" />
					<div className="relative">
						<div className="flex items-center gap-2 text-emerald-400 mb-6">
							<div className="w-2 h-2 rounded-full bg-emerald-400" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								WITH STARTUPKIT
							</span>
						</div>
						<div className="space-y-4 font-mono text-sm">
							<div className="flex items-start gap-3">
								<Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
								<span className="text-zinc-300">
									@repo/auth → Better Auth, ready
								</span>
							</div>
							<div className="flex items-start gap-3">
								<Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
								<span className="text-zinc-300">
									@repo/db → Drizzle + Postgres, configured
								</span>
							</div>
							<div className="flex items-start gap-3">
								<Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
								<span className="text-zinc-300">
									@repo/ui → 60+ Shadcn components
								</span>
							</div>
							<div className="flex items-start gap-3">
								<Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
								<span className="text-zinc-300">
									Monorepo structure → share everything
								</span>
							</div>
							<div className="flex items-start gap-3">
								<Check className="w-4 h-4 text-emerald-500 mt-0.5 flex-shrink-0" />
								<span className="text-zinc-300">
									AGENTS.md → AI knows the architecture
								</span>
							</div>
						</div>
						<div className="mt-8 pt-6 border-t border-zinc-800">
							<p className="text-zinc-300 text-sm">
								Start at <span className="text-white font-semibold">70%</span>
								. AI handles the details, not the foundation.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
