import { ArrowLeft, Github } from "lucide-react"
import { Link } from "react-router-dom"
import { SEO } from "../components/seo"

export function TermsPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<SEO
				title="Terms of Service"
				description="Read the Terms of Service for StartupKit. Learn about the MIT license and usage terms."
				path="/terms"
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

				<h1 className="text-4xl font-semibold mb-8">Terms of Service</h1>

				<div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400">
					<p className="text-lg">Last updated: January 2026</p>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							Acceptance of Terms
						</h2>
						<p>
							By accessing and using StartupKit, you agree to be bound by these
							Terms of Service and all applicable laws and regulations.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">Use License</h2>
						<p>
							StartupKit is released under the MIT License. You are free to use,
							copy, modify, merge, publish, distribute, sublicense, and/or sell
							copies of the software.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">Disclaimer</h2>
						<p>
							The software is provided "as is", without warranty of any kind,
							express or implied, including but not limited to the warranties of
							merchantability, fitness for a particular purpose and
							noninfringement.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							Limitation of Liability
						</h2>
						<p>
							In no event shall StartupKit or its contributors be liable for any
							claim, damages or other liability, whether in an action of
							contract, tort or otherwise, arising from, out of or in connection
							with the software.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							Changes to Terms
						</h2>
						<p>
							We reserve the right to modify these terms at any time. We will
							notify users of any changes by updating the date at the top of
							this page.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">Contact Us</h2>
						<p>
							If you have questions about these Terms of Service, please contact
							us at legal@startupkit.com.
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
