import { Metadata } from "next";
import { Features } from "@/components/Features";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { Hero } from "@/components/Hero";
import Particles from "@/components/Particles";
import { Stack } from "@/components/Stack";

export const metadata: Metadata = {
  title: "StartupKit - Everything you need to launch a SaaS product",
  description:
    "Built using modern open-source frameworks and packed full of integrations, StartupKit provides everything you need to build, grow, and scale your startup.",
};

export default function Home() {
  return (
    <main className="">
      <Header />
      <div className="h-[70vh] md:h-[40vh] min-h-[80vh] md:min-h-[600px] bg-gradient relative">
        <Particles className="absolute top-0 w-screen h-full" />
        <Hero />
      </div>
      <Stack className="mb-20" />
      <Features />
      <Footer />
    </main>
  );
}
