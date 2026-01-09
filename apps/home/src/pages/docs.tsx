import { ArrowLeft, BookOpen } from "lucide-react"
import { Link } from "react-router-dom"
import { SEO } from "../components/seo"

export function DocsPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<SEO
				title="Documentation"
				description="StartupKit documentation - comprehensive guides and API references for building your SaaS application."
				path="/docs"
			/>
			<nav className="border-b border-zinc-800">
				<div className="container mx-auto px-6 py-4">
					<div className="flex items-center justify-between">
						<Link to="/" className="flex items-center gap-2">
							<span className="text-xl font-semibold">startupkit</span>
						</Link>
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

				<div className="flex flex-col items-center justify-center text-center py-20">
					<div className="w-16 h-16 rounded-2xl bg-zinc-800/50 flex items-center justify-center mb-6">
						<BookOpen className="w-8 h-8 text-zinc-400" />
					</div>
					<h1 className="text-4xl font-semibold mb-4">Docs coming soon</h1>
					<p className="text-zinc-400 text-lg max-w-md">
						We're working on comprehensive documentation to help you get the
						most out of StartupKit. Check back soon!
					</p>
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
