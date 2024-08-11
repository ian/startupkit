import Head from "next/head";
import { Footer } from "@/components/home/Footer";
import { Hero } from "@/components/home/Hero";

export default function Home() {
  return (
    <>
      <Head>
        <title>StartupKit - Everything you need to launch a SaaS product</title>
        <meta
          name="description"
          content="Built using modern open-source frameworks and packed full of integrations, StartupKit provides everything you need to build, grow, and scale your startup."
        />
        <link rel="canonical" href="https://startupkit.com" />
      </Head>
      <Hero />
    </>
  );
}
