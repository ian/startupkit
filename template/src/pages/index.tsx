import { Footer } from "@/components/home/home-footer";
import { Header } from "@/components/home/home-header";
import { Hero } from "@/components/home/home-hero";

export default function Home() {
	return (
		<>
			<Header />
			<main>
				<Hero />
			</main>
			<Footer />
		</>
	);
}

Home.getLayout = function getLayout(page: React.ReactElement) {
	return <>{page}</>;
};
