import { Hono } from "hono"
import { deductCredits, logToolUsage } from "./lib/credits.js"
import type { AuthVariables } from "./middleware/auth.js"
import { createProvider } from "./providers/index.js"

export const domainsRouter = new Hono<{ Variables: AuthVariables }>()

domainsRouter.post("/search", async (c) => {
	const user = c.get("user")
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	const {
		name,
		extensions,
		provider: providerId
	} = await c.req.json<{
		name: string
		extensions?: string[]
		provider?: string
	}>()

	if (!name) {
		return c.json({ error: "Domain name is required" }, 400)
	}

	const exts = extensions?.length
		? extensions
		: [".com", ".io", ".co", ".ai", ".app"]

	const creditCost = exts.length
	const deducted = await deductCredits(
		c.env.DB,
		user.id,
		creditCost,
		"domains",
		`Domain search: ${name}`
	)

	if (!deducted.success) {
		return c.json({ error: "Insufficient credits" }, 402)
	}

	const domainProvider = await getUserDomainProvider(
		c.env.DB,
		user.id,
		providerId
	)

	let domains
	if (domainProvider) {
		domains = await domainProvider.search({ name, extensions: exts })
	} else {
		domains = await checkDomainAvailabilityFallback(name, exts)
	}

	await logToolUsage(
		c.env.DB,
		user.id,
		"domains",
		creditCost,
		{ name, extensions: exts },
		domains
	)

	return c.json({
		data: domains,
		creditsUsed: creditCost,
		creditsRemaining: deducted.creditsRemaining
	})
})

domainsRouter.get("/providers", async (c) => {
	const user = c.get("user")
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	const db = c.env.DB
	const providers = await db
		.prepare(
			"SELECT * FROM domain_provider_settings WHERE user_id = ? AND is_active = 1"
		)
		.bind(user.id)
		.all()

	return c.json({
		data: providers.results.map((p: Record<string, unknown>) => ({
			id: p.id,
			provider: p.provider,
			isActive: p.is_active,
			createdAt: p.created_at
		}))
	})
})

domainsRouter.post("/providers", async (c) => {
	const user = c.get("user")
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	const { provider, apiKey, apiSecret, settings } = await c.req.json<{
		provider: string
		apiKey: string
		apiSecret?: string
		settings?: Record<string, unknown>
	}>()

	if (!provider || !apiKey) {
		return c.json({ error: "Provider and API key are required" }, 400)
	}

	const db = c.env.DB
	const id = crypto.randomUUID()

	await db
		.prepare(
			`INSERT INTO domain_provider_settings (id, user_id, provider, api_key, api_secret, settings, is_active)
     VALUES (?, ?, ?, ?, ?, ?, 1)
     ON CONFLICT(user_id) WHERE provider = ? DO UPDATE SET
       api_key = excluded.api_key,
       api_secret = excluded.api_secret,
       settings = excluded.settings,
       updated_at = datetime('now')`
		)
		.bind(
			id,
			user.id,
			provider,
			apiKey,
			apiSecret || null,
			settings ? JSON.stringify(settings) : null,
			provider
		)
		.run()

	return c.json({ success: true, id })
})

domainsRouter.delete("/providers/:id", async (c) => {
	const user = c.get("user")
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	const { id } = c.req.param()
	const db = c.env.DB

	await db
		.prepare(
			"DELETE FROM domain_provider_settings WHERE id = ? AND user_id = ?"
		)
		.bind(id, user.id)
		.run()

	return c.json({ success: true })
})

interface DomainResult {
	name: string
	available: boolean
	price?: number
	renewalPrice?: number
	registrar: string
}

async function getUserDomainProvider(
	db: D1Database,
	userId: string,
	providerId?: string
) {
	const result = await db
		.prepare(
			providerId
				? "SELECT * FROM domain_provider_settings WHERE user_id = ? AND provider = ? AND is_active = 1"
				: "SELECT * FROM domain_provider_settings WHERE user_id = ? AND is_active = 1"
		)
		.bind(...(providerId ? [userId, providerId] : [userId]))
		.first<{
			id: string
			provider: string
			api_key: string
			api_secret: string | null
			settings: string | null
		}>()

	if (!result) {
		return null
	}

	return createProvider(result.provider, {
		apiKey: result.api_key,
		apiSecret: result.api_secret || undefined
	})
}

async function checkDomainAvailabilityFallback(
	name: string,
	extensions: string[]
): Promise<DomainResult[]> {
	return extensions.map((ext) => ({
		name: `${name}${ext}`,
		available: Math.random() > 0.5,
		price: 9.99 + Math.random() * 10,
		renewalPrice: 12.99 + Math.random() * 10,
		registrar: "Mock"
	}))
}
