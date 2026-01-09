import "./docs.css"
import { DocsLayout } from "fumadocs-ui/layouts/docs"
import type { ReactNode } from "react"
import { source } from "@/app/source"

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<DocsLayout
			tree={source.pageTree}
			nav={{
				title: "StartupKit",
				url: "/"
			}}
			sidebar={{
				collapsible: true
			}}
			links={[
				{
					text: "Home",
					url: "/"
				},
				{
					text: "GitHub",
					url: "https://github.com/ian/startupkit",
					external: true
				},
				{
					text: "Discord",
					url: "https://discord.gg/gRmD4TJCas",
					external: true
				}
			]}
		>
			{children}
		</DocsLayout>
	)
}
