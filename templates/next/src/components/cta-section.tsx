import { Container } from "@/components/container";
import { ButtonLink } from "@brokerbot/ui/components/button";

export default function CTASection() {
  return (
    <section className="py-16">
      <Container className="text-center relative z-10">
        <h2 className="text-3xl font-bold font-serif mb-6">Ready to Transform your Brokerage?</h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          Join the future of real estate brokerage with BrokerBot and experience unparalleled efficiency and growth.
        </p>
        <ButtonLink size="xl" href="https://cal.com/jt-hotsheet/brokerbot-demo" target="_blank">Schedule a Demo</ButtonLink>
      </Container>
    </section>
  );
}
