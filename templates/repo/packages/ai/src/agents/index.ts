import { RuntimeContext } from "@mastra/core/di"
import { Mastra } from "@mastra/core/mastra"
import { createLogger } from "@mastra/core/logger"
import { LangfuseExporter } from "langfuse-vercel"
import { weatherAgent } from "./weather"

export { RuntimeContext }

export const agents = {
	weatherAgent
}

export type AgentName = keyof typeof agents

/**
 * The agents exported by this package. These agents are all instances of
 * the `Agent` interface, and are used to generate code based on user input.
 *
 * @example
 * import { agents } from "@repo/ai"
 * const agent = agents.weatherAgent
 * const response = await agent.generate("What is the weather like in San Francisco?")
 */

export const mastra = new Mastra({
	agents,
	logger: createLogger({
		name: "Mastra",
		level: "info"
	}),
	telemetry: {
		enabled: true,
		serviceName: "ai",
		sampling: {
			type: "always_on"
		},
		export: {
			type: "custom",
			exporter: new LangfuseExporter({
				publicKey: process.env.LANGFUSE_PUBLIC_KEY,
				secretKey: process.env.LANGFUSE_SECRET_KEY,
				baseUrl: process.env.LANGFUSE_BASEURL
			})
		}
	}
})

/**
 * The main entry point for the AI package.
 *
 * This module exports the `agents` object, which contains the
 * definitions of all the agents in the system.
 *
 * It also exports the `getAgent` function, which can be used to
 * retrieve an agent by name.
 *
 * Finally, it exports the `mastra` object, which is an instance of
 * the Mastra framework. This object is used to manage the agents
 * and their associated runtime contexts.
 */

export const getAgent = (agent: AgentName) => {
	return mastra.getAgent(agent)
}


/**
 * Creates a new runtime context initialized with the specified user and team.
 *
 * @param user - The user associated with the runtime context.
 * @param team - The team associated with the runtime context.
 * @returns A {@link RuntimeContext} instance containing the provided user and team.
 */
export function createRuntimeContext<T>(props: T): RuntimeContext<T> {
	const runtimeContext = new RuntimeContext<T>()
	for (const [key,val] of Object.entries(props)) {
		runtimeContext.set(key, val)
	}

	return runtimeContext
}
