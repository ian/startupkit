import { Hero } from "@/components/home/hero";
import CTA from "@/components/home/cta";
import { Header } from "@/components/home/header";
import { Footer } from "@/components/home/footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="px-4">
        <Hero />
        <CTA />
        <Footer />
      </main>
    </>
  );
}
