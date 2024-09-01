import { Hero } from "@/components/home/home-hero";
import { Header } from "@/components/home/home-header";
import { Footer } from "@/components/home/home-footer";

export default function Home() {
  return (
    <>
      <Header />
      <main className="bg-gray-900">
        <Hero />
      </main>
      <Footer />
    </>
  );
}
