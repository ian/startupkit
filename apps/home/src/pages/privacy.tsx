import { ArrowLeft } from "lucide-react"
import { Link } from "react-router-dom"
import { Footer } from "../components/footer"
import { Navigation } from "../components/navigation"
import { SEO } from "../components/seo"

export function PrivacyPage() {
	return (
		<div className="min-h-screen bg-black text-white">
			<SEO
				title="Privacy Policy"
				description="Learn how StartupKit collects, uses, and protects your personal information. Read our privacy policy."
				path="/privacy"
			/>
			<Navigation />

			<main className="container mx-auto px-6 py-20 max-w-3xl">
				<Link
					to="/"
					className="inline-flex items-center gap-2 text-zinc-400 hover:text-white transition-colors mb-8"
				>
					<ArrowLeft className="w-4 h-4" />
					Back to home
				</Link>

				<h1 className="text-4xl font-semibold mb-8">Privacy Policy</h1>

				<div className="prose prose-invert prose-zinc max-w-none space-y-6 text-zinc-400">
					<p className="text-lg">Last updated: January 2026</p>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">Introduction</h2>
						<p>
							This privacy policy describes how StartupKit ("we", "us", or
							"our") collects, uses, and shares information about you when you
							use our website and services.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							Information We Collect
						</h2>
						<p>
							We collect information you provide directly to us, such as when
							you create an account, use our services, or contact us for
							support.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							How We Use Information
						</h2>
						<p>
							We use the information we collect to provide, maintain, and
							improve our services, and to communicate with you.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">
							Information Sharing
						</h2>
						<p>
							We do not sell your personal information. We may share information
							with third-party service providers who perform services on our
							behalf.
						</p>
					</section>

					<section className="space-y-4">
						<h2 className="text-2xl font-medium text-white">Contact Us</h2>
						<p>
							If you have questions about this privacy policy, please contact us
							at privacy@startupkit.com.
						</p>
					</section>
				</div>
			</main>

			<Footer />
		</div>
	)
}
