import { Link } from "react-router-dom"
import { Logo } from "./logo"

export function Footer() {
	return (
		<footer className="border-t border-zinc-800 mt-32">
			<div className="container mx-auto px-6 py-16">
				<div className="grid grid-cols-2 md:grid-cols-4 gap-8">
					<div className="col-span-2 md:col-span-1">
						<Logo icon size="lg" />
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
							{/* <li>
								<a
									href="/blog"
									className="text-zinc-400 hover:text-white transition-colors text-sm"
								>
									Blog
								</a>
							</li> */}
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
	)
}
