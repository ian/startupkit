import { Check } from "lucide-react"

export function ServicesSection() {
	return (
		<section className="my-48 max-w-6xl mx-auto">
			<div className="text-center mb-12">
				<h2 className="text-3xl md:text-4xl font-normal tracking-tight mb-4">
					One click add any service
				</h2>
				<p className="text-zinc-400 text-lg">
					Expand your monorepo with new apps instantly
				</p>
			</div>
			<div className="grid grid-cols-1 md:grid-cols-3 gap-6">
				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
					<div className="flex justify-center mb-4">
					<svg
						className="w-12 h-12 text-white"
						viewBox="0 0 180 180"
						fill="currentColor"
						aria-hidden="true"
					>
							<mask
								id="mask0_nextjs"
								maskUnits="userSpaceOnUse"
								x="0"
								y="0"
								width="180"
								height="180"
							>
								<circle cx="90" cy="90" r="90" fill="white" />
							</mask>
							<g mask="url(#mask0_nextjs)">
								<circle cx="90" cy="90" r="90" fill="black" />
								<path
									d="M149.508 157.52L69.142 54H54v71.97h12.114V69.384l73.885 95.461a90.304 90.304 0 009.509-7.325z"
									fill="url(#paint0_linear_nextjs)"
								/>
								<rect
									x="115"
									y="54"
									width="12"
									height="72"
									fill="url(#paint1_linear_nextjs)"
								/>
							</g>
							<defs>
								<linearGradient
									id="paint0_linear_nextjs"
									x1="109"
									y1="116.5"
									x2="144.5"
									y2="160.5"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="white" />
									<stop offset="1" stopColor="white" stopOpacity="0" />
								</linearGradient>
								<linearGradient
									id="paint1_linear_nextjs"
									x1="121"
									y1="54"
									x2="120.799"
									y2="106.875"
									gradientUnits="userSpaceOnUse"
								>
									<stop stopColor="white" />
									<stop offset="1" stopColor="white" stopOpacity="0" />
								</linearGradient>
							</defs>
						</svg>
					</div>
					<h3 className="text-xl font-medium text-white mb-2">Next.js</h3>
					<p className="text-zinc-400 text-sm mb-4">
						Full-stack React framework
					</p>
					<span className="inline-flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
						<Check className="w-4 h-4" />
						Available
					</span>
				</div>
				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center">
					<div className="flex justify-center mb-4">
						<img
							src="/images/vite-logo.png"
							alt="Vite"
							className="w-12 h-12 object-contain"
						/>
					</div>
					<h3 className="text-xl font-medium text-white mb-2">Vite</h3>
					<p className="text-zinc-400 text-sm mb-4">
						Lightning fast frontend tooling
					</p>
					<span className="inline-flex items-center gap-1.5 text-emerald-500 text-sm font-medium">
						<Check className="w-4 h-4" />
						Available
					</span>
				</div>
				<div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-8 text-center opacity-60">
					<div className="flex justify-center mb-4">
						<img
							src="/images/expo-logo.png"
							alt="Expo"
							className="w-12 h-12 object-contain brightness-0 invert"
						/>
					</div>
					<h3 className="text-xl font-medium text-white mb-2">Expo</h3>
					<p className="text-zinc-400 text-sm mb-4">
						React Native for mobile
					</p>
					<span className="inline-flex items-center gap-1.5 text-zinc-500 text-sm font-medium">
						Coming soon
					</span>
				</div>
			</div>
		</section>
	)
}
