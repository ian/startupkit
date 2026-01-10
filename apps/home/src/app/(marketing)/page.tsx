import { AIReadySection } from "@/components/ai-ready-section"
import { BentoFeaturesSection } from "@/components/bento-features-section"
import { CTASection } from "@/components/cta-section"
import { FAQSection } from "@/components/faq-section"
import { HeroSection } from "@/components/hero-section"
import { ProblemSection } from "@/components/problem-section"
import { ServicesSection } from "@/components/services-section"

export default function HomePage() {
	return (
		<main className="container mx-auto px-6 py-20">
			<HeroSection />
			<AIReadySection />
			<ProblemSection />
			<BentoFeaturesSection />
			<ServicesSection />
			<FAQSection />
			<CTASection />
		</main>
	)
}
