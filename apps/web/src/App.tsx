import { AIReadySection } from "./components/ai-ready-section"
import { BentoFeaturesSection } from "./components/bento-features-section"
import { CTASection } from "./components/cta-section"
import { FAQSection } from "./components/faq-section"
import { Footer } from "./components/footer"
import { HeroSection } from "./components/hero-section"
import { Navigation } from "./components/navigation"
import { ProblemSection } from "./components/problem-section"
import { ServicesSection } from "./components/services-section"

export default function App() {
	return (
		<div className="min-h-screen bg-black text-white">
			<Navigation />

			<main className="container mx-auto px-6 py-20">
				<HeroSection />
				<AIReadySection />
				<ProblemSection />
				<BentoFeaturesSection />
				<ServicesSection />
				<FAQSection />
				<CTASection />
			</main>

			<Footer />
		</div>
	)
}
