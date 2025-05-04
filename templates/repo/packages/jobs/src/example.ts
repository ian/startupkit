import { task } from "@trigger.dev/sdk"

export type TestJobPayload = {
	name: string
}

export const testJob = task({
	id: "testJob",
	run: async (payload: TestJobPayload, { ctx }) => {
		const { name } = payload
		return `Hello, ${name}`
	}
})
