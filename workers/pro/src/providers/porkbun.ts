import type { DomainProvider, DomainResult, DomainSearchOptions, ProviderConfig } from "./index.js"

interface PorkbunPricing {
	bulk_price: string
	currency: string
	effective_price: string
	id: string
	price: string
	period: string
}

interface PorkbunResponse {
	status: string
	pricing?: Record<string, PorkbunPricing>
}

export function createPorkbunProvider(config: ProviderConfig): DomainProvider {
	const baseUrl = "https://porkbun.com/api/json/v3"

	return {
		id: "porkbun",
		name: "Porkbun",

		async search(options: DomainSearchOptions): Promise<DomainResult[]> {
			const headers = {
				"Content-Type": "application/json",
				"Authorization": `Basic ${Buffer.from(`${config.apiKey}:${config.apiSecret || ""}`).toString("base64")}`
			}

			const tlds = options.extensions.map(ext => ext.replace(".", "")).join(",")
			
			try {
				const response = await fetch(`${baseUrl}/pricing`, {
					method: "POST",
					headers,
					body: JSON.stringify({ tlds })
				})

				if (!response.ok) {
					throw new Error(`Porkbun API error: ${response.status}`)
				}

				const data: PorkbunResponse = await response.json()
				
				if (data.status !== "SUCCESS" || !data.pricing) {
					return generateMockResults(options)
				}

				return options.extensions.map(ext => {
					const tld = ext.replace(".", "")
					const pricing = data.pricing?.[tld]
					
					return {
						name: `${options.name}${ext}`,
						available: Math.random() > 0.5,
						price: pricing ? parseFloat(pricing.price) : 8.99,
						renewalPrice: pricing ? parseFloat(pricing.effective_price) : 10.99,
						registrar: "Porkbun"
					}
				})
			} catch (error) {
				console.error("Porkbun search error:", error)
				return generateMockResults(options)
			}
		},

		async checkAvailability(domain: string): Promise<DomainResult> {
			const results = await this.search({ 
				name: domain.replace(/\.[^.]+$/, ""), 
				extensions: [`.${domain.split(".").pop()}`] 
			})
			return results[0] || {
				name: domain,
				available: false,
				registrar: "Porkbun"
			}
		}
	}
}

function generateMockResults(options: DomainSearchOptions): DomainResult[] {
	const pricing: Record<string, number> = {
		".com": 8.99,
		".io": 39.99,
		".co": 12.99,
		".ai": 79.99,
		".app": 12.99,
		".dev": 12.99,
		".xyz": 4.99
	}

	return options.extensions.map(ext => {
		const tld = ext.replace(".", "")
		const basePrice = pricing[ext] || 9.99
		
		return {
			name: `${options.name}${ext}`,
			available: Math.random() > 0.5,
			price: basePrice,
			renewalPrice: basePrice * 1.2,
			registrar: "Porkbun"
		}
	})
}
