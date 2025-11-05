import { drizzle } from "drizzle-orm/node-postgres"
import { Pool } from "pg"
import * as schema from "./schema"

if (!process.env.DATABASE_URL) {
	throw new Error(
		"DATABASE_URL environment variable is not set. Please add it to your .env.local file."
	)
}

const globalForDb = globalThis as unknown as {
	pool: Pool | undefined
}

const pool =
	globalForDb.pool ??
	new Pool({
		connectionString: process.env.DATABASE_URL,
		max: 20,
		idleTimeoutMillis: 30000,
		connectionTimeoutMillis: 2000,
		allowExitOnIdle: true
	})

if (process.env.NODE_ENV !== "production") globalForDb.pool = pool

pool.on("error", (err) => {
	console.error("Unexpected database pool error", err)
})

export const db = drizzle({ client: pool, schema })

export * from "./schema"
