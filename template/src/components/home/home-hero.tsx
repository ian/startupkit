import Link from "next/link";
import { Logo } from "../logo";

export function Hero() {
	return (
		<div className="">
			<div className="relative isolate pt-14">
				<div className="">
					<div className="px-6 mx-auto max-w-7xl lg:px-8">
						<div className="max-w-3xl mx-auto text-center">
							<h1 className="text-4xl font-bold tracking-tight text-gray-900">
								Welcome to <Logo className="inline h-16 ml-4" />
							</h1>
							<p className="mt-6 text-lg leading-8 text-gray-600">
								Anim aute id magna aliqua ad ad non deserunt sunt. Qui irure qui
								lorem cupidatat commodo. Elit sunt amet fugiat veniam occaecat
								fugiat aliqua.
							</p>
							<div className="flex items-center justify-center mt-10 gap-x-6">
								<Link
									href="/api/auth/login"
									className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
								>
									Get started
								</Link>
								<a
									href="https://startupkit.com"
									className="text-sm font-semibold leading-6 text-gray-900"
								>
									Learn more <span aria-hidden="true">→</span>
								</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	);
}
