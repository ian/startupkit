import { cn } from "@/ui/utils"
import Image from "next/image"
import Link from "next/link"
import { Container } from "./Container"

export const Stack = ({ className }: { className?: string }) => {
	return (
		<Container>
			<section
				className={cn(className, "space-y-2 grid lg:grid-cols-10 gap-10")}
			>
				{/* <h4 className="text-center text-gray-500">Built on the latest stack</h4> */}
				<div className="space-y-4 lg:col-span-4">
					<h2 className="text-4xl tracking-tight font-extrabold text-white font-serif">
						{/* Built Using the Latest and Greatest Stack */}
						The ultimate open-source SaaS framework
					</h2>
					<p className="text-gray-400">
						StartupKit is powered by the most advanced and reliable technologies
						to ensure your startup&apos;s success from day one. Our framework is
						built on Next.js, incorporating the best practices and tools in the
						industry.
					</p>

					<p className="text-gray-400">
						With StartupKit, you&apos;re not just getting a
						framework&mdash;you&apos;re getting the best foundation for your
						startup to thrive.
					</p>
				</div>
				<div className="grid grid-cols-3 items-center justify-center w-full gap-5 lg:col-span-6">
					{STACK.map((stack) => (
						<Link
							href={stack.href}
							target="_blank"
							className="p-5 text-white rounded-xl hover:bg-blue/10 flex flex-column items-center justify-center"
							key={stack.label}
						>
							<Image
								src={stack.image}
								alt={stack.label}
								className={stack.className}
							/>
						</Link>
					))}
				</div>
			</section>
		</Container>
	)
}

const STACK = [
	{
		label: "NextJS",
		href: "https://nextjs.org/",
		image: require("@/images/stack/nextjs.svg"),
		className: "h-7"
	},
	{
		label: "Typescript",
		href: "https://www.typescriptlang.org/",
		image: require("@/images/stack/typescript.svg"),
		className: "h-8"
	},
	{
		label: "Tailwind CSS",
		href: "https://tailwindcss.com/",
		image: require("@/images/stack/tailwind.svg"),
		className: "h-7"
	},
	{
		label: "shadcn/ui",
		href: "https://ui.shadcn.com/",
		image: require("@/images/stack/shadcn-ui.svg"),
		className: "h-9"
	},
	{
		label: "Framer Motion",
		href: "https://www.framer.com/motion/",
		image: require("@/images/stack/framer-motion.svg"),
		className: "h-8"
	},
	{
		label: "Lucide",
		href: "https://lucide.dev/",
		image: require("@/images/stack/lucide.svg"),
		className: "h-8"
	}
]
