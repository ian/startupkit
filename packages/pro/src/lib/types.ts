export interface TrendsInterestResponse {
	query: string
	timeline: {
		date: string
		value: number
	}[]
	geoMap?: {
		region: string
		value: number
	}[]
}

export interface TrendsRelatedResponse {
	query: string
	related: {
		phrase: string
		score: number
	}[]
}

export interface SeoOverviewResponse {
	domain: string
	authority: number
	backlinks: number
	referringDomains: number
	organicKeywords: number
	organicTraffic: number
	priceEstimate?: number
}

export interface SeoKeywordsResponse {
	domain: string
	keywords: {
		keyword: string
		position: number
		volume: number
		difficulty: number
		cpc: number
	}[]
}

export interface SeoBacklinksResponse {
	domain: string
	backlinks: {
		source: string
		target: string
		anchor: string
		authority: number
	}[]
	total: number
}

export interface DomainSearchResponse {
	domains: {
		name: string
		available: boolean
		price?: number
		renewalPrice?: number
		tld: string
	}[]
	seed: string
}

export interface DomainWhoisResponse {
	domain: string
	registrar?: string
	createdDate?: string
	expiryDate?: string
	nameservers?: string[]
	status?: string[]
}

export interface KeywordOpportunitiesResponse {
	seed: string
	keywords: {
		keyword: string
		volume: number
		difficulty: number
		cpc: number
		opportunity: number
	}[]
}

export interface AppSearchResponse {
	query: string
	apps: {
		name: string
		developer: string
		store: "ios" | "android"
		installs?: string
		rating?: number
		category?: string
		price?: number
		description?: string
	}[]
}

export interface ResearchSummaryResponse {
	topic: string
	trends: {
		interest: number
		timeline: { date: string; value: number }[]
		related: string[]
	}
	seo: {
		authority: number
		organicKeywords: number
		topKeywords: { keyword: string; position: number }[]
	}
	keywords: {
		keyword: string
		volume: number
		difficulty: number
		opportunity: number
	}[]
	domains: {
		suggestion: string
		available: boolean
	}[]
	summary: string
}

export interface CreditsResponse {
	balance: number
	plan: "starter" | "pro" | "enterprise"
	usage: {
		tool: string
		count: number
		creditsUsed: number
	}[]
}
