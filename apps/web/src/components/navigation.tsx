import { Link } from "react-router-dom"
import { GitHubStarButton } from "./github-star-button"

export function Navigation() {
	return (
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
						<GitHubStarButton />
					</div>
				</div>
			</div>
		</nav>
	)
}
