import Link from "next/link"
import { GitHubStarButton } from "./github-star-button"
import { Logo } from "./logo"

export function Navigation() {
	return (
		<nav className="border-b border-zinc-800">
			<div className="container mx-auto px-6 py-4">
				<div className="flex items-center justify-between">
					<Logo />
					<div className="hidden md:flex items-center gap-8">
						<Link
							href="/docs"
							className="text-sm font-normal text-zinc-300 hover:text-white transition-colors"
						>
							Docs
						</Link>
						<Link
							href="https://discord.gg/gRmD4TJCas"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-normal text-zinc-300 hover:text-white transition-colors"
						>
							Community
						</Link>
						<Link
							href="https://startupkit.featurebase.app/roadmap"
							target="_blank"
							rel="noopener noreferrer"
							className="text-sm font-normal text-zinc-300 hover:text-white transition-colors"
						>
							Roadmap
						</Link>
						<GitHubStarButton />
					</div>
				</div>
			</div>
		</nav>
	)
}
