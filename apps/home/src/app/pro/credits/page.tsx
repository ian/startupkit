"use client"

import { useState } from "react"

interface CreditTransaction {
	id: string
	amount: number
	type: string
	tool: string | null
	description: string | null
	createdAt: string
}

export default function CreditsPage() {
	const [timeframe, setTimeframe] = useState<"7d" | "30d" | "90d">("30d")

	return (
		<div className="space-y-8">
			<div>
				<h1 className="text-3xl font-bold">Credits</h1>
				<p className="mt-2 text-zinc-400">
					Monitor your credit usage and transaction history
				</p>
			</div>

			<div className="grid gap-6 md:grid-cols-3">
				<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<div className="text-sm text-zinc-400">Monthly Allocation</div>
					<div className="mt-2 text-4xl font-bold">10</div>
					<div className="mt-1 text-sm text-zinc-500">starter plan</div>
				</div>

				<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<div className="text-sm text-zinc-400">Bonus Credits</div>
					<div className="mt-2 text-4xl font-bold">10</div>
					<div className="mt-1 text-sm text-zinc-500">new user bonus</div>
				</div>

				<div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
					<div className="text-sm text-zinc-400">Available</div>
					<div className="mt-2 text-4xl font-bold text-green-400">20</div>
					<div className="mt-1 text-sm text-zinc-500">total available</div>
				</div>
			</div>

			<div>
				<div className="flex items-center justify-between">
					<h2 className="text-xl font-semibold">Transaction History</h2>
					<select
						value={timeframe}
						onChange={(e) =>
							setTimeframe(e.target.value as "7d" | "30d" | "90d")
						}
						className="rounded border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm"
					>
						<option value="7d">Last 7 days</option>
						<option value="30d">Last 30 days</option>
						<option value="90d">Last 90 days</option>
					</select>
				</div>

				<div className="mt-4 overflow-hidden rounded-lg border border-zinc-800">
					<table className="w-full">
						<thead className="bg-zinc-900">
							<tr>
								<th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
									Date
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
									Description
								</th>
								<th className="px-4 py-3 text-left text-sm font-medium text-zinc-400">
									Tool
								</th>
								<th className="px-4 py-3 text-right text-sm font-medium text-zinc-400">
									Amount
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-zinc-800">
							<tr>
								<td className="px-4 py-3 text-zinc-400" colSpan={4}>
									No transactions yet. Start using the tools to see your
									history.
								</td>
							</tr>
						</tbody>
					</table>
				</div>
			</div>

			<div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-6">
				<h3 className="text-lg font-semibold">Need More Credits?</h3>
				<p className="mt-2 text-zinc-400">
					Upgrade to Pro for 1,000 credits/month or Enterprise for 10,000
					credits/month.
				</p>
				<button className="mt-4 rounded bg-cyan-500 px-4 py-2 font-medium text-black transition-colors hover:bg-cyan-400">
					Upgrade Plan
				</button>
			</div>
		</div>
	)
}
