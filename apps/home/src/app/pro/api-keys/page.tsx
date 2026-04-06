"use client"

import { useState } from "react"

interface ApiKey {
	id: string
	name: string
	key: string
	createdAt: string
	lastUsedAt: string | null
}

export default function ApiKeysPage() {
	const [keys, setKeys] = useState<ApiKey[]>([])
	const [showCreate, setShowCreate] = useState(false)
	const [newKeyName, setNewKeyName] = useState("")

	return (
		<div className="space-y-8">
			<div className="flex items-center justify-between">
				<div>
					<h1 className="text-3xl font-bold">API Keys</h1>
					<p className="mt-2 text-zinc-400">
						Manage API keys for CLI and MCP access
					</p>
				</div>
				<button
					onClick={() => setShowCreate(true)}
					className="rounded bg-cyan-500 px-4 py-2 font-medium text-black transition-colors hover:bg-cyan-400"
				>
					Create New Key
				</button>
			</div>

			{showCreate && (
				<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<h3 className="text-lg font-semibold">Create API Key</h3>
					<div className="mt-4">
						<label className="block text-sm text-zinc-400">
							Key Name
							<input
								type="text"
								value={newKeyName}
								onChange={(e) => setNewKeyName(e.target.value)}
								placeholder="My API Key"
								className="mt-1 block w-full rounded border border-zinc-700 bg-zinc-800 px-3 py-2"
							/>
						</label>
					</div>
					<div className="mt-4 flex gap-3">
						<button
							onClick={() => {
								setShowCreate(false)
								setNewKeyName("")
							}}
							className="rounded border border-zinc-700 px-4 py-2 transition-colors hover:bg-zinc-800"
						>
							Cancel
						</button>
						<button className="rounded bg-cyan-500 px-4 py-2 font-medium text-black transition-colors hover:bg-cyan-400">
							Create
						</button>
					</div>
				</div>
			)}

			<div className="overflow-hidden rounded-lg border border-zinc-800">
				<table className="w-full">
					<thead className="bg-zinc-900">
						<tr>
							<th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
								Name
							</th>
							<th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
								API Key
							</th>
							<th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
								Created
							</th>
							<th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
								Last Used
							</th>
							<th className="px-4 py-3 text-right text-sm font-medium text-zinc-400">
								Actions
							</th>
						</tr>
					</thead>
					<tbody className="divide-y divide-zinc-800">
						{keys.length === 0 ? (
							<tr>
								<td className="px-4 py-8 text-center text-zinc-400" colSpan={5}>
									No API keys yet. Create one to get started.
								</td>
							</tr>
						) : (
							keys.map((key) => (
								<tr key={key.id}>
									<td className="px-4 py-3 font-medium">{key.name}</td>
									<td className="px-4 py-3 font-mono text-sm text-zinc-400">
										sk_pro_••••••••••••••••
									</td>
									<td className="px-4 py-3 text-zinc-400">
										{new Date(key.createdAt).toLocaleDateString()}
									</td>
									<td className="px-4 py-3 text-zinc-400">
										{key.lastUsedAt
											? new Date(key.lastUsedAt).toLocaleDateString()
											: "Never"}
									</td>
									<td className="px-4 py-3 text-right">
										<button className="text-red-400 hover:text-red-300">
											Delete
										</button>
									</td>
								</tr>
							))
						)}
					</tbody>
				</table>
			</div>

			<div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
				<h3 className="text-lg font-semibold">Using Your API Key</h3>
				<p className="mt-2 text-zinc-400">
					Configure your API key for CLI usage:
				</p>
				<pre className="mt-3 rounded bg-zinc-950 p-4 font-mono text-sm">
					<code>export STARTUPKIT_API_KEY=&quot;sk_pro_your_key_here&quot;</code>
				</pre>
				<p className="mt-4 text-zinc-400">
					Or add it to your MCP configuration:
				</p>
				<pre className="mt-3 rounded bg-zinc-950 p-4 font-mono text-sm">
					<code>{`[mcp_servers.startupkit_pro]
command = "node"
args = ["packages/mcp-pro/dist/index.js"]
env = { STARTUPKIT_API_KEY = "sk_pro_your_key_here" }`}</code>
				</pre>
			</div>
		</div>
	)
}
