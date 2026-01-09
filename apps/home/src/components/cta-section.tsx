import { INIT_COMMAND } from "../lib/constants"
import { CopyButton } from "./copy-button"

export function CTASection() {
	return (
		<section className="mt-32 text-center max-w-3xl mx-auto">
			<p className="text-brand text-sm font-semibold mb-4">
				Get started
			</p>
			<h2 className="text-4xl md:text-5xl font-semibold tracking-tight mb-6 text-balance">
				Stop burning tokens.
				<br />
				Start shipping faster.
			</h2>
			<p className="text-zinc-400 text-lg mb-8 max-w-xl mx-auto">
				One command. Production-ready monorepo. All the infrastructure you
				need to launch your startup.
			</p>
			<div className="flex items-center justify-center gap-3 max-w-md mx-auto">
				<div className="bg-zinc-900 border border-zinc-800 rounded-xl px-5 py-4 font-mono text-sm text-zinc-300">
					<span className="text-zinc-500 mr-2">{">"}</span>
					<span>{INIT_COMMAND}</span>
				</div>
				<CopyButton text={INIT_COMMAND} />
			</div>
		</section>
	)
}
