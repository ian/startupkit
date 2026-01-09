import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "./components/ui/accordion"
import { Button } from "./components/ui/button"
import {
	BarChart3,
	Bot,
	Check,
	Copy,
	Database,
	GitBranch,
	Github,
	Mail,
	Palette,
	Search,
	Shield,
	Sparkles
} from "lucide-react"
import { useState } from "react"
import { Link } from "react-router-dom"

function PackageRow({
	name,
	description
}: {
	name: string
	description: string
}) {
	return (
		<div className="flex items-center gap-3">
			<Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
			<span className="text-cyan-400 min-w-[140px]">{name}</span>
			<span className="text-zinc-500">→</span>
			<span className="text-zinc-400">{description}</span>
		</div>
	)
}

function TwoslashToken({
	children,
	typeContent
}: {
	children: React.ReactNode
	typeContent: React.ReactNode
}) {
	return (
		<span className="group relative inline cursor-help">
			{children}
			<span className="pointer-events-none absolute left-0 bottom-full mb-2 z-50 hidden group-hover:block">
				<span className="block bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-xs font-mono shadow-xl whitespace-pre text-left">
					{typeContent}
				</span>
				<span className="absolute left-4 top-full w-0 h-0 border-l-[6px] border-r-[6px] border-t-[6px] border-l-transparent border-r-transparent border-t-zinc-700" />
			</span>
		</span>
	)
}

function CopyButton({ text }: { text: string }) {
	const [copied, setCopied] = useState(false)

	const handleCopy = async () => {
		await navigator.clipboard.writeText(text)
		setCopied(true)
		setTimeout(() => setCopied(false), 2000)
	}

	return (
		<Button
			onClick={handleCopy}
			className={`w-28 px-6 py-4 h-auto rounded-xl text-base font-medium transition-all border-0 ${
				copied
					? "bg-emerald-500 hover:bg-emerald-500 text-white"
					: "bg-[#4B4DF5] hover:bg-[#3b3dd5] text-white"
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

export default function App() {
	return (
		<div className="min-h-screen bg-black text-white">
			{/* Navigation */}
			<nav className="border-b border-zinc-800">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<div className="flex items-center gap-2">
							<span className="text-xl font-semibold">startupkit</span>
						</div>
						<div className="hidden md:flex items-center gap-8">
						<Link
							to="/docs"
							className="text-sm font-normal text-zinc-300 hover:text-white transition-colors"
						>
							Docs
						</Link>
						<a
							href="https://discord.gg/startupkit"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-normal text-zinc-300 hover:text-white transition-colors"
						>
							Community
						</a>
						<a
							href="https://github.com/01-studio/startupkit"
							target="_blank"
							rel="noopener noreferrer"
							className="flex items-center gap-2 text-sm font-normal text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70"
						>
							<Github className="w-4 h-4" />
							<span>Star</span>
							<span className="px-2 py-0.5 bg-zinc-800 rounded text-xs font-medium">
								568
							</span>
						</a>
						</div>
					</div>
				</div>
			</nav>

			<main className="container mx-auto px-6 py-20">
				{/* Hero Section */}
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

					<div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden font-mono text-sm">
						<div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800 bg-zinc-900/50">
							<div className="w-3 h-3 rounded-full bg-zinc-700" />
							<div className="w-3 h-3 rounded-full bg-zinc-700" />
							<div className="w-3 h-3 rounded-full bg-zinc-700" />
							<span className="ml-2 text-zinc-500 text-xs">~/my-startup</span>
						</div>
						<div className="p-5 space-y-4">
							<div className="text-zinc-400">
								<span className="text-emerald-500">$</span> npx startupkit init
							</div>
							<div className="text-zinc-500 pt-2">
								Setting up your monorepo...
							</div>
							<div className="space-y-3 pt-2">
								<PackageRow name="@repo/auth" description="Better Auth configured" />
								<PackageRow name="@repo/analytics" description="PostHog, GA4 ready" />
								<PackageRow name="@repo/db" description="Drizzle + Postgres" />
								<PackageRow name="@repo/ui" description="60+ Shadcn components" />
								<PackageRow name="@repo/emails" description="React Email templates" />
								<PackageRow name="@repo/seo" description="Meta, OG, sitemap" />
							</div>
							<div className="pt-4 border-t border-zinc-800 mt-4">
								<div className="flex items-center gap-2 text-emerald-500">
									<Check className="w-4 h-4" />
									<span>
										Ready to build. Run{" "}
										<span className="text-white">pnpm dev</span> to start.
									</span>
								</div>
							</div>
						</div>
					</div>
				</div>

				{/* AI Ready Section */}
				<div className="mt-24 text-center">
					<p className="text-zinc-500 text-sm font-medium mb-8">
						Designed for the new era of development
					</p>
					<div className="flex items-center justify-center gap-16 flex-wrap">
						<div className="flex items-center gap-3">
							<img
								src="/images/devin-logo.png"
								alt="Devin"
								className="h-10 w-auto object-contain"
							/>
							<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
								<Check className="w-4 h-4 text-emerald-500" />
								Ready
							</span>
						</div>
						<div className="flex items-center gap-3">
							<img
								src="/images/claude-logo.png"
								alt="Claude"
								className="h-6 w-auto object-contain brightness-0 invert"
							/>
							<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
								<Check className="w-4 h-4 text-emerald-500" />
								Ready
							</span>
						</div>
						<div className="flex items-center gap-3">
							<img
								src="/images/amp-logo.png"
								alt="Amp"
								className="h-8 w-auto object-contain brightness-0 invert"
							/>
							<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
								<Check className="w-4 h-4 text-emerald-500" />
								Ready
							</span>
						</div>
						<div className="flex items-center gap-3">
							<img
								src="/images/opencode-logo.png"
								alt="OpenCode"
								className="h-6 w-auto object-contain"
							/>
							<span className="flex items-center gap-1 text-zinc-500 text-sm font-medium">
								<Check className="w-4 h-4 text-emerald-500" />
								Ready
							</span>
						</div>
					</div>
				</div>

				{/* Problem Section */}
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

				{/* Bento Features Section */}
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
									<code className="text-zinc-300">
										<span className="text-purple-400">const</span>{" "}
										<TwoslashToken
											typeContent={
												<>
													<span className="text-purple-400">const</span>{" "}
													<span className="text-cyan-400">user</span>
													<span className="text-zinc-400">:</span>{" "}
													<span className="text-green-400">User</span>{" "}
													<span className="text-zinc-400">|</span>{" "}
													<span className="text-orange-400">undefined</span>
												</>
											}
										>
											<span className="text-zinc-100 border-b border-dashed border-zinc-600">
												user
											</span>
										</TwoslashToken>
										<span className="text-zinc-100"> = </span>
										<span className="text-purple-400">await</span>{" "}
										<TwoslashToken
											typeContent={
												<>
													<span className="text-purple-400">const</span>{" "}
													<span className="text-cyan-400">db</span>
													<span className="text-zinc-400">:</span>{" "}
													<span className="text-green-400">DrizzleDB</span>
													<span className="text-zinc-400">&lt;</span>
													<span className="text-purple-400">typeof</span>{" "}
													<span className="text-cyan-400">schema</span>
													<span className="text-zinc-400">&gt;</span>
												</>
											}
										>
											<span className="text-zinc-100 border-b border-dashed border-zinc-600">
												db
											</span>
										</TwoslashToken>
										<span className="text-zinc-100">.</span>
										<TwoslashToken
											typeContent={
												<>
													<span className="text-cyan-400">query</span>
													<span className="text-zinc-400">:</span>{" "}
													<span className="text-green-400">
														DrizzleRelationalQuery
													</span>
												</>
											}
										>
											<span className="text-zinc-100 border-b border-dashed border-zinc-600">
												query
											</span>
										</TwoslashToken>
										<span className="text-zinc-100">.</span>
										<TwoslashToken
											typeContent={
												<>
													<span className="text-cyan-400">users</span>
													<span className="text-zinc-400">:</span>{" "}
													<span className="text-green-400">UsersRelations</span>
												</>
											}
										>
											<span className="text-zinc-100 border-b border-dashed border-zinc-600">
												users
											</span>
										</TwoslashToken>
										<span className="text-zinc-100">.</span>
										<TwoslashToken
											typeContent={
												<>
													<span className="text-yellow-400">findFirst</span>
													<span className="text-zinc-400">(</span>
													<span className="text-cyan-400">config</span>
													<span className="text-zinc-400">?:</span>{" "}
													<span className="text-green-400">FindFirstConfig</span>
													<span className="text-zinc-400">&lt;</span>
													<span className="text-green-400">User</span>
													<span className="text-zinc-400">&gt;</span>
													<span className="text-zinc-400">)</span>
													<span className="text-zinc-400">:</span>{" "}
													<span className="text-green-400">Promise</span>
													<span className="text-zinc-400">&lt;</span>
													<span className="text-green-400">User</span>{" "}
													<span className="text-zinc-400">|</span>{" "}
													<span className="text-orange-400">undefined</span>
													<span className="text-zinc-400">&gt;</span>
												</>
											}
										>
											<span className="text-yellow-400 border-b border-dashed border-zinc-600">
												findFirst
											</span>
										</TwoslashToken>
										<span className="text-zinc-100">()</span>
									</code>
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

				{/* One click add any service section */}
				<section className="my-48 max-w-6xl mx-auto">
					<div className="text-center mb-12">
						<h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-4">
							One click add any service
						</h2>
						<p className="text-zinc-400 text-lg">
							Expand your monorepo with new apps instantly
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
							<div className="flex justify-center mb-4">
								<svg
									className="w-12 h-12 text-white"
									viewBox="0 0 180 180"
									fill="currentColor"
								>
									<mask
										id="mask0_nextjs"
										maskUnits="userSpaceOnUse"
										x="0"
										y="0"
										width="180"
										height="180"
									>
										<circle cx="90" cy="90" r="90" fill="white" />
									</mask>
									<g mask="url(#mask0_nextjs)">
										<circle cx="90" cy="90" r="90" fill="black" />
										<path
											d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z"
											fill="url(#paint0_linear_nextjs)"
										/>
										<rect
											x="115"
											y="54"
											width="12"
											height="72"
											fill="url(#paint1_linear_nextjs)"
										/>
									</g>
									<defs>
										<linearGradient
											id="paint0_linear_nextjs"
											x1="109"
											y1="116.5"
											x2="144.5"
											y2="160.5"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="white" />
											<stop offset="1" stopColor="white" stopOpacity="0" />
										</linearGradient>
										<linearGradient
											id="paint1_linear_nextjs"
											x1="121"
											y1="54"
											x2="120.799"
											y2="106.875"
											gradientUnits="userSpaceOnUse"
										>
											<stop stopColor="white" />
											<stop offset="1" stopColor="white" stopOpacity="0" />
										</linearGradient>
									</defs>
								</svg>
							</div>
							<h3 className="text-xl font-medium text-white mb-2">Next.js</h3>
							<p className="text-zinc-400 text-sm mb-4">
								Full-stack React framework
							</p>
							<span className="inline-flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
								<Check className="w-4 h-4" />
								Available
							</span>
						</div>
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
							<div className="flex justify-center mb-4">
								<img
									src="/images/vite-logo.png"
									alt="Vite"
									className="w-12 h-12 object-contain"
								/>
							</div>
							<h3 className="text-xl font-medium text-white mb-2">Vite</h3>
							<p className="text-zinc-400 text-sm mb-4">
								Lightning fast frontend tooling
							</p>
							<span className="inline-flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
								<Check className="w-4 h-4" />
								Available
							</span>
						</div>
						<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center opacity-60">
							<div className="flex justify-center mb-4">
								<img
									src="/images/expo-logo.png"
									alt="Expo"
									className="w-12 h-12 object-contain brightness-0 invert"
								/>
							</div>
							<h3 className="text-xl font-medium text-white mb-2">Expo</h3>
							<p className="text-zinc-400 text-sm mb-4">
								React Native for mobile
							</p>
							<span className="inline-flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
								Coming soon
							</span>
						</div>
					</div>
				</section>

				{/* FAQ Section */}
				<section className="mt-32 max-w-4xl mx-auto">
					<h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-12">
						Questions? Answers.
					</h2>
					<Accordion type="single" collapsible className="w-full">
						<AccordionItem value="item-1" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								What exactly is StartupKit?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								A CLI that scaffolds a complete monorepo with auth, analytics,
								SEO, database, UI, and email pre-configured. You run one
								command, get a production-ready codebase, and start building
								your actual product.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-2" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								Is it free?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								Yes. MIT licensed. Use it for anything—personal projects, client
								work, startups, whatever.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-3" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								How is this different from other Next.js boilerplates?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								Most boilerplates are templates you clone and fight with.
								StartupKit is an architecture—a monorepo with shared packages,
								clear conventions, and patterns designed for AI-assisted
								development. You're not just getting code, you're getting
								structure.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-4" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								What's the tech stack?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								Next.js 16, React 19, TypeScript (strict mode), Tailwind CSS,
								Shadcn UI, Drizzle ORM, Better Auth, pnpm workspaces, and Turbo.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-5" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								Do I own the code?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								100%. Once you run `npx startupkit init`, it's your codebase. No
								runtime dependencies on us. Fork it, modify it, delete the parts
								you don't need.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-6" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								Can I swap out the defaults?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								Yes. Don't like Drizzle? Use Prisma. Prefer Clerk over Better
								Auth? Swap it. The packages are yours to modify.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-7" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								What do you mean by "AI-ready"?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								Clear file structure, consistent patterns, TypeScript strict
								mode, and built-in AGENTS.md that tells AI tools how your
								codebase works. When your AI assistant understands the
								architecture, it writes better code.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-8" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								What do I need to get started?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								Node.js 18+, pnpm, and a Postgres database. Run `npx startupkit
								init` and follow the prompts.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-9" className="border-zinc-800">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								Can I add more apps later?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								Yes. Run `npx startupkit add next --name dashboard` to add a new
								Next.js app that shares all your existing packages.
							</AccordionContent>
						</AccordionItem>
						<AccordionItem value="item-10" className="border-zinc-800 border-b-0">
							<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
								Is there support?
							</AccordionTrigger>
							<AccordionContent className="text-zinc-400">
								GitHub Issues for bugs. Discord for questions and community.
								Docs at startupkit.com.
							</AccordionContent>
						</AccordionItem>
					</Accordion>
				</section>

				{/* CTA Section */}
				<section className="mt-32 text-center max-w-3xl mx-auto">
					<p className="text-[#4B4DF5] text-sm font-semibold mb-4">
						Get started
					</p>
					<h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-balance">
						Stop configuring.
						<br />
						Start building.
					</h2>
					<p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
						One command. Production-ready monorepo. All the infrastructure you
						need to launch your startup.
					</p>
					<div className="flex items-center justify-center gap-3 max-w-md mx-auto">
						<div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 font-mono text-sm text-zinc-300">
							<span className="text-zinc-500 mr-2">{">"}</span>
							<span>npx startupkit init</span>
						</div>
						<CopyButton text="npx startupkit init" />
					</div>
				</section>
			</main>

			{/* Footer */}
			<footer className="border-t border-zinc-800 mt-32">
				<div className="container mx-auto px-6 py-16">
					<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
						<div className="col-span-2 md:col-span-1">
							<span className="text-xl font-semibold">startupkit</span>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Product</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="/#features"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										Features
									</a>
								</li>
								<li>
									<a
										href="/changelog"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										Changelog
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Resources</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="/docs"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										Documentation
									</a>
								</li>
								<li>
									<a
										href="/blog"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										Blog
									</a>
								</li>
								<li>
									<a
										href="#getting"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										Getting Started
									</a>
								</li>
							</ul>
						</div>
						<div>
							<h3 className="text-white font-semibold mb-4">Community</h3>
							<ul className="space-y-3">
								<li>
									<a
										href="https://discord.gg/gRmD4TJCas"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										Discord
									</a>
								</li>
								<li>
									<a
										href="https://github.com/ian/startupkit"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										GitHub
									</a>
								</li>
								<li>
									<a
										href="https://x.com/01stdio"
										className="text-zinc-400 hover:text-white transition-colors text-sm"
									>
										Twitter
									</a>
								</li>
							</ul>
						</div>
					</div>
					<div className="border-t border-zinc-800 mt-12 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
						<p className="text-zinc-500 text-sm">
							Built by{" "}
							<a
								href="https://01.studio"
								className="text-zinc-400 hover:text-white transition-colors"
							>
								01
							</a>
						</p>
						<div className="flex items-center gap-6">
							<Link
								to="/privacy"
								className="text-zinc-500 hover:text-white transition-colors text-sm"
							>
								Privacy
							</Link>
							<Link
								to="/terms"
								className="text-zinc-500 hover:text-white transition-colors text-sm"
							>
								Terms
							</Link>
						</div>
					</div>
				</div>
			</footer>
		</div>
	)
}
