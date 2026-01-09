import { ArrowLeft, Github } from "lucide-react"
import { Link } from "react-router-dom"
import { SEO } from "../components/seo"

export function PrivacyPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<SEO
				title="Privacy Policy"
				description="Learn how StartupKit collects, uses, and protects your personal information. Read our privacy policy."
				path="/privacy"
			/>
			<nav className="border-b border-zinc-800">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="flex items-center gap-2">
							<span className="text-xl font-semibold">startupkit</span>
						</Link>
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

			<main className="container mx-auto px-6 py-20 max-w-3xl">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to home
				</Link>

				<h1 className="text-4xl font-semibold mb-8">Privacy Policy</h1>

				<div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400">
					<p className="text-lg">Last updated: January 2026</p>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">Introduction</h2>
						<p>
							This privacy policy describes how StartupKit ("we", "us", or
							"our") collects, uses, and shares information about you when you
							use our website and services.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							Information We Collect
						</h2>
						<p>
							We collect information you provide directly to us, such as when
							you create an account, use our services, or contact us for
							support.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							How We Use Information
						</h2>
						<p>
							We use the information we collect to provide, maintain, and
							improve our services, and to communicate with you.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							Information Sharing
						</h2>
						<p>
							We do not sell your personal information. We may share information
							with third-party service providers who perform services on our
							behalf.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">Contact Us</h2>
						<p>
							If you have questions about this privacy policy, please contact us
							at privacy@startupkit.com.
						</p>
					</section>
				</div>
			</main>

			<footer className="border-t border-zinc-800 mt-32">
				<div className="container mx-auto px-6 py-8">
					<div className="flex flex-col md:flex-row items-center justify-between gap-4">
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
