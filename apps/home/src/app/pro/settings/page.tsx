"use client"

import { useState } from "react"

const providers = [
	{ id: "namecheap", name: "Namecheap", logo: "🌐" },
	{ id: "porkbun", name: "Porkbun", logo: "🐷" }
]

export default function SettingsPage() {
	const [selectedProvider, setSelectedProvider] = useState("namecheap")
	const [apiKey, setApiKey] = useState("")
	const [apiSecret, setApiSecret] = useState("")
	const [saved, setSaved] = useState(false)

	const handleSave = () => {
		setSaved(true)
		setTimeout(() => setSaved(false), 3000)
	}

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Settings</h1>
				<p className="mt-2 text-zinc-400">
					Configure your domain provider and preferences
				</p>
			</div>

			<div className="space-y-6">
				<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<h3 className="text-lg font-semibold">Domain Provider</h3>
					<p className="mt-1 text-sm text-zinc-400">
						Choose your preferred domain registrar for availability checks and
						purchases.
					</p>

					<div className="mt-4 grid gap-4 md:grid-cols-2">
						{providers.map((provider) => (
							<button
								key={provider.id}
								onClick={() => setSelectedProvider(provider.id)}
								className={`flex items-center gap-4 rounded-lg border p-4 transition-colors ${
									selectedProvider === provider.id
										? "border-cyan-500 bg-zinc-800"
										: "border-zinc-700 hover:border-zinc-600"
								}`}
							>
								<span className="text-2xl">{provider.logo}</span>
								<div className="text-left">
									<div className="font-medium">{provider.name}</div>
									<div className="text-sm text-zinc-400">{provider.id}</div>
								</div>
								{selectedProvider === provider.id && (
									<span className="ml-auto text-cyan-500">✓</span>
								)}
							</button>
						))}
					</div>
				</div>

				<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<h3 className="text-lg font-semibold">API Credentials</h3>
					<p className="mt-1 text-sm text-zinc-400">
						Enter your API credentials for{" "}
						{providers.find((p) => p.id === selectedProvider)?.name}.
					</p>

					<div className="mt-4 space-y-4">
						<div>
							<label className="block text-sm text-zinc-400">
								API Key
								<input
									type="password"
									value={apiKey}
									onChange={(e) => setApiKey(e.target.value)}
									placeholder="Enter your API key"
									className="mt-1 block w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2"
								/>
							</label>
						</div>

						<div>
							<label className="block text-sm text-zinc-400">
								API Secret
								<input
									type="password"
									value={apiSecret}
									onChange={(e) => setApiSecret(e.target.value)}
									placeholder="Enter your API secret"
									className="mt-1 block w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2"
								/>
							</label>
						</div>
					</div>

					<div className="mt-6 flex items-center gap-4">
						<button
							onClick={handleSave}
							className="rounded bg-cyan-500 px-4 py-2 font-medium text-black transition-colors hover:bg-cyan-400"
						>
							Save Changes
						</button>
						{saved && (
							<span className="text-sm text-green-400">Changes saved!</span>
						)}
					</div>
				</div>

				<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<h3 className="text-lg font-semibold">Plan</h3>
					<div className="mt-4">
						<div className="flex items-center justify-between rounded-lg border border-zinc-700 p-4">
							<div>
								<div className="font-medium capitalize">starter</div>
								<div className="text-sm text-zinc-400">
									10 credits/month + 10 bonus
								</div>
							</div>
							<button className="rounded border border-cyan-500 px-4 py-2 text-cyan-400 transition-colors hover:bg-cyan-500/10">
								Upgrade
							</button>
						</div>
					</div>

					<div className="mt-4 grid gap-4 md:grid-cols-3">
						<div className="rounded border border-zinc-700 p-4">
							<div className="text-sm text-zinc-400">Pro</div>
							<div className="mt-1 text-2xl font-bold">$29/mo</div>
							<div className="mt-1 text-sm text-zinc-500">1,000 credits</div>
						</div>
						<div className="rounded border border-zinc-700 p-4">
							<div className="text-sm text-zinc-400">Enterprise</div>
							<div className="mt-1 text-2xl font-bold">$99/mo</div>
							<div className="mt-1 text-sm text-zinc-500">10,000 credits</div>
						</div>
						<div className="rounded border border-zinc-700 p-4">
							<div className="text-sm text-zinc-400">Custom</div>
							<div className="mt-1 text-2xl font-bold">Contact</div>
							<div className="mt-1 text-sm text-zinc-500">Unlimited</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	)
}
