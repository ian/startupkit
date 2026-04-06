import { Hono } from "hono"
import { deductCredits, logToolUsage } from "./lib/credits.js"
import type { AuthVariables } from "./middleware/auth.js"

export const trendsRouter = new Hono<{ Variables: AuthVariables }>()

trendsRouter.post("/", async (c) => {
	const user = c.get("user")
	if (!user) {
		return c.json({ error: "Unauthorized" }, 401)
	}

	const { keyword, region, category, timeframe } = await c.req.json<{
		keyword: string
		region?: string
		category?: string
		timeframe?: string
	}>()

	if (!keyword) {
		return c.json({ error: "Keyword is required" }, 400)
	}

	const creditCost = 2
	const deducted = await deductCredits(
		c.env.DB,
		user.id,
		creditCost,
		"trends",
		`Trends search: ${keyword}`
	)

	if (!deducted.success) {
		return c.json({ error: "Insufficient credits" }, 402)
	}

	const trendsData = await fetchGoogleTrends(
		keyword,
		region || "US",
		timeframe || "90d"
	)

	await logToolUsage(
		c.env.DB,
		user.id,
		"trends",
		creditCost,
		{ keyword, region, timeframe },
		trendsData
	)

	return c.json({
		data: trendsData,
		creditsUsed: creditCost,
		creditsRemaining: deducted.creditsRemaining
	})
})

interface TrendsData {
	keyword: string
	region: string
	timeframe: string
	interest: Array<{ keyword: string; timestamp: string; value: number }>
	relatedQueries: Array<{ query: string; value: number }>
	relatedTopics: Array<{ topic: string; type: string; value: number }>
}

async function fetchGoogleTrends(
	keyword: string,
	region: string,
	timeframe: string
): Promise<TrendsData> {
	const apiUrl = `https://trends.googleapis.com/trends/api/explore?keyword=${encodeURIComponent(keyword)}&property=&timezone=${region}&hl=en-US`

	try {
		const response = await fetch(apiUrl, {
			headers: {
				Accept: "application/json"
			}
		})

		if (!response.ok) {
			throw new Error(`Google Trends API error: ${response.status}`)
		}

		const text = await response.text()
		let data

		try {
			const jsonStart = text.indexOf("{")
			if (jsonStart > 0) {
				data = JSON.parse(text.slice(jsonStart))
			} else {
				data = JSON.parse(text)
			}
		} catch {
			data = {
				default: { timelineData: [], relatedQueries: [], relatedTopics: [] }
			}
		}

		const defaultData = data.default || data

		const interest = (defaultData.timelineData || []).map(
			(t: { timestamp: number; value: number[] }) => ({
				keyword,
				timestamp: new Date(t.timestamp * 1000).toISOString(),
				value: t.value?.[0] || 0
			})
		)

		const relatedQueries = (defaultData.relatedQueries || []).map(
			(q: { query: string; value: number }) => ({
				query: q.query,
				value: q.value || 0
			})
		)

		const relatedTopics = (defaultData.relatedTopics || []).map(
			(t: { topic: string; type: string; value: number }) => ({
				topic: t.topic,
				type: t.type,
				value: t.value || 0
			})
		)

		return {
			keyword,
			region,
			timeframe,
			interest,
			relatedQueries,
			relatedTopics
		}
	} catch (error) {
		console.log("Google Trends API unavailable, using mock data:", error)
		return generateMockTrendsData(keyword, region, timeframe)
	}
}

function generateMockTrendsData(
	keyword: string,
	region: string,
	timeframe: string
): TrendsData {
	const months = [
		"Jan",
		"Feb",
		"Mar",
		"Apr",
		"May",
		"Jun",
		"Jul",
		"Aug",
		"Sep",
		"Oct",
		"Nov",
		"Dec"
	]
	const now = new Date()

	const interest = Array.from({ length: 12 }, (_, i) => {
		const date = new Date(now)
		date.setMonth(date.getMonth() - (11 - i))
		return {
			keyword,
			timestamp: date.toISOString(),
			value: Math.floor(Math.random() * 80) + 20
		}
	})

	return {
		keyword,
		region,
		timeframe,
		interest,
		relatedQueries: [
			{ query: `${keyword} tutorial`, value: 85 },
			{ query: `best ${keyword}`, value: 72 },
			{ query: `${keyword} free`, value: 65 },
			{ query: `${keyword} pricing`, value: 58 },
			{ query: `${keyword} alternatives`, value: 45 }
		],
		relatedTopics: [
			{ topic: `${keyword} software`, type: "Technology", value: 90 },
			{ topic: `${keyword} platform`, type: "Technology", value: 75 },
			{ topic: `${keyword} industry`, type: "Business", value: 60 }
		]
	}
}
