import Hero from "@/components/hero";
import Meteors from "@/components/meteors";
// import Newsletter from "@/components/newsletter";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen">
      <Meteors />
      <Hero />
      {/* <Newsletter /> */}
    </main>
  );
}
