import "./docs.css"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"
import Image from "next/image"
import { source } from "@/app/source"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.pageTree}
			nav={{
				title: (
					<div className="flex items-center gap-2">
						<Image
							src="/startupkit-logo.png"
							alt="StartupKit"
							width={28}
							height={28}
							className="h-7 w-auto"
						/>
						<span className="font-semibold">startupkit</span>
					</div>
				),
				url: "/"
			}}
			sidebar={{
				enabled: true,
				collapsible: true,
				tabs: false,
				defaultOpenLevel: 2
			}}
			links={[
				{
					text: "Home",
					url: "/"
				},
				{
					text: "Github",
					url: "https://github.com/ian/startupkit",
					external: true
				},
				{
					text: "Discord",
					url: "https://discord.gg/gRmD4TJCas",
					external: true
				},
				{
					text: "Roadmap",
					url: "https://startupkit.featurebase.app/roadmap",
					external: true
				}
			]}
		>
			{children}
		</DocsLayout>
	)
}
