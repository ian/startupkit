import type { Metadata } from "next"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"

export const metadata: Metadata = {
	title: "Terms of Service",
	description:
		"Read the Terms of Service for StartupKit. Learn about the MIT license and usage terms."
}

export default function TermsPage() {
	return (
		<main className="container mx-auto px-6 py-20 max-w-3xl">
			<Link
				href="/"
				className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
			>
				<ArrowLeft className="w-4 h-4" />
				Back to home
			</Link>

			<h1 className="text-4xl font-semibold mb-8">Terms of Service</h1>

			<div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400">
				<p className="text-lg">Last updated: January 2026</p>

				<section className="space-y-4">
					<h2 className="text-2xl font-medium text-white">
						Acceptance of Terms
					</h2>
					<p>
						By accessing and using StartupKit, you agree to be bound by these
						Terms of Service and all applicable laws and regulations.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-2xl font-medium text-white">Use License</h2>
					<p>
						StartupKit is released under the MIT License. You are free to use,
						copy, modify, merge, publish, distribute, sublicense, and/or sell
						copies of the software.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-2xl font-medium text-white">Disclaimer</h2>
					<p>
						The software is provided &ldquo;as is&rdquo;, without warranty of
						any kind, express or implied, including but not limited to the
						warranties of merchantability, fitness for a particular purpose
						and noninfringement.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-2xl font-medium text-white">
						Limitation of Liability
					</h2>
					<p>
						In no event shall StartupKit or its contributors be liable for any
						claim, damages or other liability, whether in an action of
						contract, tort or otherwise, arising from, out of or in connection
						with the software.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-2xl font-medium text-white">
						Changes to Terms
					</h2>
					<p>
						We reserve the right to modify these terms at any time. We will
						notify users of any changes by updating the date at the top of
						this page.
					</p>
				</section>

				<section className="space-y-4">
					<h2 className="text-2xl font-medium text-white">Contact Us</h2>
					<p>
						If you have questions about these Terms of Service, please contact
						us at legal@startupkit.com.
					</p>
				</section>
			</div>
		</main>
	)
}
