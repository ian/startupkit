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
								<p className="mx-auto md:text-xl text-gray-500">
									StartupKit is not another boilerplate / framework; it's your
									startup-in-a-box. Packed with all the essential necessities
									for any startup, you can focus on building.
								</p>
								<p className="mx-auto md:text-xl text-gray-500">
									Leverage the power of{" "}
									<Link
										href="https://nextjs.org"
										target="_blank"
										className="text-black font-semibold underline"
									>
										Next.js
									</Link>
									,{" "}
									<Link
										href="https://v0.dev"
										target="_blank"
										className="text-black font-semibold underline"
									>
										v0
									</Link>
									, and{" "}
									<Link
										href="https://cursor.so"
										target="_blank"
										className="text-black font-semibold underline"
									>
										Cursor
									</Link>{" "}
									to rapidly develop innovative solutions, while StartupKit
									provides the essential infrastructure to support your growth.
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
