import { describe, expect, it } from "vitest"
import { createRuntimeContext, getAgent } from "../agent"

const agent = getAgent("weatherAgent")

describe("agent", () => {
	it("should get a text response from the agent", async () => {
		const runtimeContext = createRuntimeContext({})
		const response = await agent.generate(
			"What is the weather like today in San Francisco?",
			{ runtimeContext }
		)
		expect(response.text).toContain("Today in San Francisco, the weather is")
	})
})
