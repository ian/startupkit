import CTA from "@/components/CTA"
import { Features } from "@/components/Features"
import { Footer } from "@/components/Footer"
import { Hero } from "@/components/Hero"
import Particles from "@/components/Particles"
import { Stack } from "@/components/Stack"
import Head from "next/head"

export default function Home() {
	return (
		<>
			<Head>
				<title>StartupKit - Everything you need to launch a SaaS product</title>
				<meta
					name="description"
					content="Built using modern open-source frameworks and packed full of integrations, StartupKit provides everything you need to build, grow, and scale your startup."
				/>
				<link rel="canonical" href="https://startupkit.com" />
			</Head>
			<div className="h-[70vh] md:h-[40vh] min-h-[80vh] md:min-h-[600px] bg-gradient relative">
				<Particles className="absolute top-0 w-screen h-full" />
				<Hero />
			</div>
			<Stack className="mb-20" />
			<Features />
			<CTA />
			<Footer />
		</>
	)
}
