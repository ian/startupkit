import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger
} from "./ui/accordion"

export function FAQSection() {
	return (
		<section className="mt-32 max-w-4xl mx-auto">
			<h2 className="text-4xl md:text-5xl font-normal tracking-tight mb-12">
				Questions? Answers.
			</h2>
			<Accordion type="single" collapsible className="w-full">
				<AccordionItem value="item-1" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						What exactly is StartupKit?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						A CLI that scaffolds a complete monorepo with auth, analytics,
						SEO, database, UI, and email pre-configured. You run one
						command, get a production-ready codebase, and start building
						your actual product.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-2" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						Is it free?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						Yes. MIT licensed. Use it for anything—personal projects, client
						work, startups, whatever.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-3" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						How is this different from other Next.js boilerplates?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						Most boilerplates are templates you clone and fight with.
						StartupKit is an architecture—a monorepo with shared packages,
						clear conventions, and patterns designed for AI-assisted
						development. You're not just getting code, you're getting
						structure.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-4" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						What's the tech stack?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						Next.js 16, React 19, TypeScript (strict mode), Tailwind CSS,
						Shadcn UI, Drizzle ORM, Better Auth, pnpm workspaces, and Turbo.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-5" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						Do I own the code?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						100%. Once you run `npx startupkit init`, it's your codebase. No
						runtime dependencies on us. Fork it, modify it, delete the parts
						you don't need.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-6" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						Can I swap out the defaults?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						Yes. Don't like Drizzle? Use Prisma. Prefer Clerk over Better
						Auth? Swap it. The packages are yours to modify.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-7" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						What do you mean by "AI-ready"?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						Clear file structure, consistent patterns, TypeScript strict
						mode, and built-in AGENTS.md that tells AI tools how your
						codebase works. When your AI assistant understands the
						architecture, it writes better code.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-8" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						What do I need to get started?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						Node.js 18+, pnpm, and a Postgres database. Run `npx startupkit
						init` and follow the prompts.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-9" className="border-zinc-800">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						Can I add more apps later?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						Yes. Run `npx startupkit add next --name dashboard` to add a new
						Next.js app that shares all your existing packages.
					</AccordionContent>
				</AccordionItem>
				<AccordionItem value="item-10" className="border-zinc-800 border-b-0">
					<AccordionTrigger className="text-white text-base font-medium hover:no-underline">
						Is there support?
					</AccordionTrigger>
					<AccordionContent className="text-zinc-400">
						GitHub Issues for bugs. Discord for questions and community.
						Docs at startupkit.com.
					</AccordionContent>
				</AccordionItem>
			</Accordion>
		</section>
	)
}
