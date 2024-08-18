import { Hero } from "@/components/home-hero";
import { Header } from "@/components/home-header";
import { Footer } from "@/components/home-footer";
import { Pricing } from "@/components/pricing";
import { getProducts } from "@startupkit/payments/server";

export default async function Home() {
  const products = await getProducts();

  return (
    <>
      <Header />
      <main>
        <Hero />
        <div className="px-4 my-40">
          <div className="text-center mb-4 max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-4xl font-bold mb-2">Pricing</h2>
            <p>
              Choose from our range of products tailored to fit your needs. Each
              product offers unique features and pricing options.
            </p>
          </div>

          <Pricing products={products} />
        </div>
        <Footer />
      </main>
    </>
  );
}
