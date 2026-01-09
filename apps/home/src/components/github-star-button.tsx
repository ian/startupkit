import { Github } from "lucide-react"
import { useEffect, useState } from "react"

export function GitHubStarButton() {
	const [starCount, setStarCount] = useState<number | null>(null)

	useEffect(() => {
		fetch("https://api.github.com/repos/ian/startupkit")
			.then((res) => res.json())
			.then((data) => {
				if (typeof data.stargazers_count === "number") {
					setStarCount(data.stargazers_count)
				}
			})
			.catch(() => {})
	}, [])

	return (
		<a
			href="https://github.com/ian/startupkit"
			target="_blank"
			rel="noopener noreferrer"
			className="flex items-center gap-2 text-sm font-normal text-zinc-300 hover:text-white transition-colors px-3 py-1.5 rounded-lg bg-zinc-800/50 hover:bg-zinc-800/70"
		>
			<Github className="w-4 h-4" />
			<span>Star</span>
			{starCount !== null && (
				<span className="px-2 py-0.5 bg-zinc-800 rounded text-xs font-medium">
					{starCount.toLocaleString()}
				</span>
			)}
		</a>
	)
}
