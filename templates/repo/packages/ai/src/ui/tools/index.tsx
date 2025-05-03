"use client"

import type { ToolInvocation } from "ai"
import { Wrench } from "lucide-react"
import { Weather } from "./weather"

export const TOOLS = {
	getWeather: Weather,
}

export const Tool = (invocation: ToolInvocation) => {
	const { toolName, state } = invocation
	const ToolComponent = TOOLS[toolName as keyof typeof TOOLS]

	if (!ToolComponent) {
		if (process.env.NODE_ENV === "development") {
			return (
				<div className="flex shrink-0 justify-end">
					<div className=" p-2 border rounded border-red-500/50 bg-red-500/10 flex items-center">
						<Wrench className="size-4 mr-2 text-red-500" /> Missing view for
						tool <pre className="text-red-500 ml-2">{toolName}</pre>
					</div>
				</div>
			)
		}

		return null
	}

	return (
		<div className="flex shrink-0 justify-end">
			{state === "result" ? (
				<ToolComponent result={invocation.result} />
			) : (
				<div className="skeleton">
					<ToolComponent />
				</div>
			)}
		</div>
	)
}
