import Link from "next/link";

import { Logo } from "@/components/logo";
import { Button } from "@/components/ui/button";

export function Hero() {
	return (
		<div className="flex flex-col">
			<main className="flex-1">
				<section className="w-full py-12 md:py-24 lg:py-32 xl:py-48">
					<div className="max-w-xl mx-auto px-4 md:px-6">
						<div className="flex flex-col items-center space-y-4 text-center">
							<div className="space-y-2">
								<h1 className="text-4xl font-bold tracking-tight text-gray-900">
									Welcome to <Logo className="inline h-16 ml-4" />
								</h1>
								<p className="mx-auto max-w-[700px] md:text-xl text-gray-500">
									StartupKit is Next.js but with all the addons a startup will
									need to launch. Out of the box you get auth, analytics, cms,
									payments, and more.
								</p>
							</div>
							<div className="w-full space-y-2">
								<div className="mx-auto grid grid-cols-2 gap-2">
									<Link href="https://docs.startupkit.com">
										<Button className="w-full" variant="outline">
											Read the Docs
										</Button>
									</Link>
									<Link href="https://docs.startupkit.com/v0">
										<Button className="w-full" variant="outline">
											Using v0 with StartupKit
										</Button>
									</Link>
								</div>
							</div>
						</div>
					</div>
				</section>
			</main>
		</div>
	);
}
