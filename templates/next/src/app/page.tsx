import HeroSection from '@/components/hero-section';
import FeaturesSection from '@/components/features-section';
import Testimonials from '@/components/testimonials';
import PricingSection from '@/components/pricing-section';
import CTASection from '@/components/cta-section';

export default function Home() {
  return (
    <>
      <HeroSection />
      <FeaturesSection />
      <Testimonials />
      <PricingSection />
      <CTASection />
    </>
  );
}
