import { createHmac, randomBytes } from "node:crypto"
import type { D1Database } from "@cloudflare/workers-types"
import type { MiddlewareHandler } from "hono"

export interface AuthVariables {
	user: {
		id: string
		email: string
		plan: string
		credits: number
		bonusCredits: number
	} | null
	userId: string | null
}

export interface Env {
	DB: D1Database
}

function hashApiKey(key: string): string {
	return createHmac("sha256", key).digest("hex")
}

function generateApiKey(): string {
	return `sk_pro_${randomBytes(24).toString("hex")}`
}

export const authMiddleware: MiddlewareHandler<{
	Variables: AuthVariables
}> = async (c, next) => {
	const authHeader = c.req.header("Authorization")

	if (!authHeader || !authHeader.startsWith("Bearer ")) {
		return c.json({ error: "Missing or invalid authorization header" }, 401)
	}

	const token = authHeader.slice(7)

	if (!token || token.length < 10) {
		return c.json({ error: "Invalid API key format" }, 401)
	}

	const db = c.env.DB
	const keyHash = hashApiKey(token)

	const result = await db
		.prepare(
			`SELECT u.id, u.email, u.plan, u.credits, u.bonus_credits 
       FROM users u
       JOIN api_keys ak ON ak.user_id = u.id
       WHERE ak.key_hash = ?`
		)
		.bind(keyHash)
		.first()

	if (!result) {
		return c.json({ error: "Invalid API key" }, 401)
	}

	await db
		.prepare(
			'UPDATE api_keys SET last_used_at = datetime("now") WHERE key_hash = ?'
		)
		.bind(keyHash)
		.run()

	c.set("user", {
		id: result.id as string,
		email: result.email as string,
		plan: result.plan as string,
		credits: result.credits as number,
		bonusCredits: result.bonus_credits as number
	})
	c.set("userId", result.id as string)

	await next()
}

export { hashApiKey, generateApiKey }
