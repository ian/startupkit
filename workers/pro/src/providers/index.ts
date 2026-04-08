export interface DomainResult {
	name: string
	available: boolean
	price?: number
	renewalPrice?: number
	registrar: string
}

export interface DomainSearchOptions {
	name: string
	extensions: string[]
}

export interface DomainProvider {
	id: string
	name: string
	search(domains: DomainSearchOptions): Promise<DomainResult[]>
	checkAvailability(domain: string): Promise<DomainResult>
}

export interface ProviderConfig {
	apiKey: string
	apiSecret?: string
	environment?: "sandbox" | "production"
}

export function createProvider(
	providerId: string,
	config: ProviderConfig
): DomainProvider | null {
	switch (providerId) {
		case "namecheap":
			return createNamecheapProvider(config)
		case "porkbun":
			return createPorkbunProvider(config)
		default:
			return null
	}
}

import { createNamecheapProvider } from "./namecheap.js"
import { createPorkbunProvider } from "./porkbun.js"

export { createNamecheapProvider, createPorkbunProvider }
