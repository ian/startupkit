import {
	BarChart3,
	Bot,
	Database,
	GitBranch,
	Mail,
	Palette,
	Search,
	Shield,
	Sparkles
} from "lucide-react"
import { DrizzleCodeSnippet } from "./drizzle-code-snippet"

export function BentoFeaturesSection() {
	return (
		<section className="my-48 max-w-6xl mx-auto">
			<div className="text-center mb-16">
				<p className="text-[#4B4DF5] text-sm font-semibold mb-3">
					Everything you need
				</p>
				<h2 className="text-4xl md:text-5xl font-normal tracking-tight text-balance">
					Give your AI agents a platform to build off
				</h2>
				<p className="mt-4 text-zinc-400 text-lg max-w-2xl mx-auto">
					Every package is pre-configured with best practices, fully typed,
					and documented for AI tools to understand.
				</p>
			</div>

			<div className="flex flex-col gap-3">
				{/* Row 1: Auth (66%) + Analytics (33%) */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div className="md:col-span-2 bg-zinc-900 p-8 rounded-tl-3xl rounded-tr-lg rounded-bl-lg rounded-br-lg">
						<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
							<Shield className="w-5 h-5" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								AUTH
							</span>
						</div>
						<h3 className="text-2xl font-medium text-white mb-3">
							Authentication that just works.
						</h3>
						<p className="text-sm text-zinc-400 leading-relaxed mb-6">
							Google OAuth. Email OTP. Session management. Built on Better
							Auth with React hooks and server utilities.
						</p>
						<div className="bg-zinc-950 rounded-lg p-4 font-mono text-sm">
							<code className="text-zinc-300">
								<span className="text-purple-400">const</span>{" "}
								<span className="text-zinc-100">{"{"}</span>
								<span className="text-cyan-400"> user</span>
								<span className="text-zinc-100">,</span>
								<span className="text-cyan-400"> isAuthenticated</span>
								<span className="text-zinc-100">,</span>
								<span className="text-cyan-400"> logout</span>
								<span className="text-zinc-100"> {"}"}</span>
								<span className="text-zinc-100"> = </span>
								<span className="text-yellow-400">useAuth</span>
								<span className="text-zinc-100">()</span>
							</code>
						</div>
					</div>
					<div className="bg-zinc-900 p-8 rounded-tl-lg rounded-tr-3xl rounded-bl-lg rounded-br-lg">
						<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
							<BarChart3 className="w-5 h-5" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								ANALYTICS
							</span>
						</div>
						<h3 className="text-xl font-medium text-white mb-3">
							One API. Every provider.
						</h3>
						<p className="text-sm text-zinc-400 leading-relaxed mb-4">
							PostHog. Google Analytics. OpenPanel. Track everywhere with a
							single hook.
						</p>
						<div className="flex items-center gap-3 mb-4">
							<img
								src="/images/posthog-logo.svg"
								alt="PostHog"
								className="h-4 w-auto opacity-60"
							/>
							<img
								src="/images/google-analytics-logo.svg"
								alt="Google Analytics"
								className="h-4 w-auto opacity-60"
							/>
						</div>
					</div>
				</div>

				{/* Row 2: SEO + Database */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div className="bg-zinc-900 p-8 rounded-lg">
						<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
							<Search className="w-5 h-5" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								SEO
							</span>
						</div>
						<h3 className="text-xl font-medium text-white mb-3">
							The metadata you always forget.
						</h3>
						<p className="text-sm text-zinc-400 leading-relaxed">
							OpenGraph. Twitter Cards. Structured data. Sitemaps.
							Robots.txt. All the SEO you need, none of the boilerplate.
						</p>
					</div>
					<div className="md:col-span-2 bg-zinc-900 p-8 rounded-lg">
						<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
							<Database className="w-5 h-5" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								DATABASE
							</span>
						</div>
						<h3 className="text-xl font-medium text-white mb-3">
							Type-safe from schema to query.
						</h3>
						<p className="text-sm text-zinc-400 leading-relaxed mb-4">
							Drizzle ORM with Postgres. Migrations that don't break.
							Query your data with full TypeScript inference.
						</p>
						<div className="bg-zinc-950 rounded-lg p-4 font-mono text-sm overflow-visible">
							<DrizzleCodeSnippet />
						</div>
						<p className="text-xs text-zinc-500 mt-2">
							Hover over tokens to see types
						</p>
					</div>
				</div>

				{/* Row 3: UI Components (66%) + Email (33%) */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div className="md:col-span-2 bg-zinc-900 p-8 rounded-lg">
						<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
							<Palette className="w-5 h-5" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								UI COMPONENTS
							</span>
						</div>
						<h3 className="text-xl font-medium text-white mb-3">
							60+ components. Ready to use.
						</h3>
						<p className="text-sm text-zinc-400 leading-relaxed mb-4">
							Shadcn UI pre-installed. Beautiful defaults. Fully
							customizable. Dark mode included.
						</p>
						<div className="flex items-center gap-4 mb-6">
							<img
								src="/images/shadcn-ui-logo.svg"
								alt="shadcn/ui"
								className="h-4 w-auto opacity-60"
							/>
							<img
								src="/images/tailwind-logo.svg"
								alt="Tailwind CSS"
								className="h-4 w-auto opacity-60"
							/>
							<img
								src="/images/lucide-logo.svg"
								alt="Lucide"
								className="h-4 w-auto opacity-60"
							/>
							<img
								src="/images/framer-motion-logo.svg"
								alt="Framer Motion"
								className="h-4 w-auto opacity-60"
							/>
						</div>
						<div className="bg-zinc-950 rounded-lg p-4 font-mono text-sm">
							<span className="text-zinc-500 mr-2">{">"}</span>
							<code className="text-zinc-400">pnpm shadcn add button</code>
						</div>
					</div>
					<div className="bg-zinc-900 p-8 rounded-lg">
						<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
							<Mail className="w-5 h-5" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								EMAIL
							</span>
						</div>
						<h3 className="text-xl font-medium text-white mb-3">
							Transactional email that looks good.
						</h3>
						<p className="text-sm text-zinc-400 leading-relaxed">
							React Email templates. Resend integration. Build emails with
							components, not HTML tables.
						</p>
					</div>
				</div>

				{/* Row 4: Monorepo + Linting + AGENTS */}
				<div className="grid grid-cols-1 md:grid-cols-3 gap-3">
					<div className="bg-zinc-900 p-8 rounded-bl-3xl rounded-tl-lg rounded-tr-lg rounded-br-lg">
						<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
							<GitBranch className="w-5 h-5" />
							<span className="text-xs font-semibold font-mono tracking-wider">
								MONOREPO
							</span>
						</div>
						<h3 className="text-xl font-medium text-white mb-3">
							Share code. Not complexity.
						</h3>
						<p className="text-sm text-zinc-400 leading-relaxed">
							pnpm workspaces + Turbo. Add apps and packages in seconds.
						</p>
					</div>
					<div className="md:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-3">
						<div className="bg-zinc-900 p-8 rounded-lg">
							<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
								<Sparkles className="w-5 h-5" />
								<span className="text-xs font-semibold font-mono tracking-wider">
									LINTING
								</span>
							</div>
							<h3 className="text-xl font-medium text-white mb-3">
								Biome. Fast and opinionated.
							</h3>
							<p className="text-sm text-zinc-400 leading-relaxed">
								Lint and format in milliseconds. Consistent code across the
								entire codebase.
							</p>
						</div>
						<div className="bg-zinc-900 p-8 rounded-tr-lg rounded-br-3xl rounded-tl-lg rounded-bl-lg">
							<div className="flex items-center gap-2 text-[#4B4DF5] mb-4">
								<Bot className="w-5 h-5" />
								<span className="text-xs font-semibold font-mono tracking-wider">
									AGENTS
								</span>
							</div>
							<h3 className="text-xl font-medium text-white mb-3">
								AI Native.
							</h3>
							<p className="text-sm text-zinc-400 leading-relaxed">
								Clear file structure, consistent patterns, and built-in
								AGENTS.md that tells AI tools how your codebase works.
							</p>
						</div>
					</div>
				</div>
			</div>
		</section>
	)
}
