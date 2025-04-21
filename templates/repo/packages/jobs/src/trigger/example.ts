import { prisma } from "@local/db";
import { task } from "@trigger.dev/sdk/v3";

export type Payload = {
	name: string;
};

export const testJob = task({
	id: "testJob",
	run: async (payload: Payload, { ctx }) => {
		const { name } = payload;
		console.log("DATABASE_URL", process.env.DATABASE_URL);
		const teams = await prisma.team.count();
		const msgs = await prisma.message.count();

		console.log({
			teams,
			msgs,
		});

		return `Hello, ${name}`;
	},
});
