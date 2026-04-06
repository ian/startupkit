import { Hono } from "hono"
import type { AuthVariables } from "./middleware/auth.js"
import { generateApiKey, hashApiKey } from "./middleware/auth.js"

export const authRouter = new Hono<{ Variables: AuthVariables }>()

authRouter.post("/register", async (c) => {
	const { email, password } = await c.req.json<{
		email: string
		password: string
	}>()

	if (!email || !password) {
		return c.json({ error: "Email and password required" }, 400)
	}

	const db = c.env.DB

	const existing = await db
		.prepare("SELECT id FROM users WHERE email = ?")
		.bind(email)
		.first()
	if (existing) {
		return c.json({ error: "Email already registered" }, 409)
	}

	const userId = crypto.randomUUID()
	const apiKey = generateApiKey()
	const apiKeyHash = hashApiKey(apiKey)
	const keyId = crypto.randomUUID()

	await db
		.prepare(
			`INSERT INTO users (id, email, api_key_hash, plan, credits, bonus_credits)
     VALUES (?, ?, ?, 'starter', 10, 10)`
		)
		.bind(userId, email, apiKeyHash)
		.run()

	await db
		.prepare(
			`INSERT INTO api_keys (id, user_id, key_hash, name)
     VALUES (?, ?, ?, 'Default Key')`
		)
		.bind(keyId, userId, apiKeyHash)
		.run()

	const user = await db
		.prepare("SELECT * FROM users WHERE id = ?")
		.bind(userId)
		.first()

	return c.json({
		user: {
			id: user!.id,
			email: user!.email,
			plan: user!.plan,
			credits: user!.credits,
			bonusCredits: user!.bonus_credits,
			createdAt: user!.created_at
		},
		token: apiKey
	})
})

authRouter.post("/login", async (c) => {
	const { apiKey } = await c.req.json<{ apiKey: string }>()

	if (!apiKey) {
		return c.json({ error: "API key required" }, 400)
	}

	const db = c.env.DB
	const keyHash = hashApiKey(apiKey)

	const result = await db
		.prepare(
			`SELECT u.id, u.email, u.plan, u.credits, u.bonus_credits, u.created_at
        FROM users u
        JOIN api_keys ak ON ak.user_id = u.id
        WHERE ak.key_hash = ?`
		)
		.bind(keyHash)
		.first<{
			id: string
			email: string
			plan: string
			credits: number
			bonus_credits: number
			created_at: string
		}>()

	if (!result) {
		return c.json({ error: "Invalid API key" }, 401)
	}

	await db
		.prepare(
			'UPDATE api_keys SET last_used_at = datetime("now") WHERE key_hash = ?'
		)
		.bind(keyHash)
		.run()

	return c.json({
		user: {
			id: result.id,
			email: result.email,
			plan: result.plan,
			credits: result.credits,
			bonusCredits: result.bonus_credits,
			createdAt: result.created_at
		},
		token: apiKey
	})
})

authRouter.post("/logout", async (c) => {
	return c.json({ success: true })
})

authRouter.get("/me", async (c) => {
	const user = c.get("user")
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	const db = c.env.DB
	const dbUser = await db
		.prepare("SELECT * FROM users WHERE id = ?")
		.bind(user.id)
		.first()

	return c.json({
		user: {
			id: dbUser!.id,
			email: dbUser!.email,
			plan: dbUser!.plan,
			credits: dbUser!.credits,
			bonusCredits: dbUser!.bonus_credits,
			createdAt: dbUser!.created_at
		}
	})
})
