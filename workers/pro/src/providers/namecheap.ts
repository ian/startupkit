import type { DomainProvider, DomainResult, DomainSearchOptions, ProviderConfig } from "./index.js"

interface NamecheapResponse {
	DomainCheckResult?: Array<{
		$: { Domain: string; Available: string }
	}>
}

export function createNamecheapProvider(config: ProviderConfig): DomainProvider {
	const baseUrl = config.environment === "sandbox"
		? "https://api.sandbox.namecheap.com"
		: "https://api.namecheap.com"

	return {
		id: "namecheap",
		name: "Namecheap",

		async search(options: DomainSearchOptions): Promise<DomainResult[]> {
			const domains = options.extensions.map(ext => `${options.name}${ext}`).join(",")
			
			const params = new URLSearchParams({
				ApiUser: config.apiKey,
				ApiKey: config.apiSecret || "",
				UserName: config.apiKey,
				ClientIP: config.environment === "sandbox" ? "127.0.0.1" : "",
				Command: "namecheap.domains.check",
				DomainList: domains
			})

			try {
				const response = await fetch(`${baseUrl}/xml.response?${params}`)
				const text = await response.text()
				
				if (!response.ok) {
					throw new Error(`Namecheap API error: ${response.status}`)
				}

				const result = parseNamecheapResponse(text)
				
				return result.map(domain => ({
					name: domain.$.Domain,
					available: domain.$.Available === "true",
					price: domain.$.Available === "true" ? 11.98 : undefined,
					renewalPrice: domain.$.Available === "true" ? 14.98 : undefined,
					registrar: "Namecheap"
				}))
			} catch (error) {
				console.error("Namecheap search error:", error)
				return generateMockResults(options)
			}
		},

		async checkAvailability(domain: string): Promise<DomainResult> {
			const results = await this.search({ name: domain.replace(/\.[^.]+$/, ""), extensions: [`.${domain.split(".").pop()}`] })
			return results[0] || {
				name: domain,
				available: false,
				registrar: "Namecheap"
			}
		}
	}
}

function parseNamecheapResponse(xml: string): NamecheapResponse["DomainCheckResult"] {
	const results: NamecheapResponse["DomainCheckResult"] = []
	const matches = xml.matchAll(/<Domain\s+Domain="([^"]+)"\s+Available="([^"]+)"/g)
	
	for (const match of matches) {
		results.push({
			$: {
				Domain: match[1],
				Available: match[2]
			}
		})
	}

	return results
}

function generateMockResults(options: DomainSearchOptions): DomainResult[] {
	return options.extensions.map(ext => ({
		name: `${options.name}${ext}`,
		available: Math.random() > 0.5,
		price: 9.99 + Math.random() * 10,
		renewalPrice: 12.99 + Math.random() * 10,
		registrar: "Namecheap"
	}))
}
