#!/usr/bin/env node

import { Command } from "commander"
import { chat } from "./commands/chat.js"
import { trends } from "./commands/trends.js"
import { seo } from "./commands/seo.js"
import { domains } from "./commands/domains.js"
import { apps } from "./commands/apps.js"
import { keywords } from "./commands/keywords.js"
import { research } from "./commands/research.js"
import { credits } from "./commands/credits.js"
import { login } from "./commands/login.js"
import { logout } from "./commands/logout.js"

export async function run() {
	const program = new Command()

	program
		.name("startupkit pro")
		.description("StartupKit Pro - Entrepreneur's AI research toolkit")

	program
		.command("chat")
		.description("Start interactive chat mode")
		.option("-t, --topic <topic>", "Initial topic to research")
		.action(async (options) => {
			await chat({ topic: options.topic })
		})

	program
		.command("trends")
		.description("Get Google Trends data")
		.argument("<query>", "Search query to analyze")
		.option("-r, --related", "Show related queries")
		.option("-g, --geo <location>", "Geographic filter (e.g., 'US', 'GB')")
		.option("-t, --timeframe <range>", "Time range (e.g., 'today 3-m', 'past-12-m')")
		.action(async (query, options) => {
			await trends({ query, ...options })
		})

	program
		.command("seo")
		.description("Get SEO analysis for a domain")
		.argument("<domain>", "Domain to analyze")
		.option("-k, --keywords", "Show top keywords")
		.option("-b, --backlinks", "Show backlink data")
		.option("-t, --traffic", "Show traffic estimates")
		.action(async (domain, options) => {
			await seo({ domain, ...options })
		})

	program
		.command("domains")
		.description("Search for available domain names")
		.argument("<seed>", "Seed keyword or phrase")
		.option("-t, --tlds <list>", "Comma-separated TLDs to check")
		.option("-w, --whois", "Show WHOIS data for results")
		.action(async (seed, options) => {
			await domains({ seed, ...options })
		})

	program
		.command("apps")
		.description("Research mobile apps")
		.argument("<query>", "App search query")
		.option("-s, --store <store>", "Store to search (ios, android, both)", "both")
		.action(async (query, options) => {
			await apps({ query, ...options })
		})

	program
		.command("keywords")
		.description("Keyword research and opportunities")
		.argument("<seed>", "Seed keyword")
		.option("-l, --limit <number>", "Max results", "20")
		.option("-d, --difficulty", "Include difficulty scores")
		.action(async (seed, options) => {
			await keywords({ seed, ...options })
		})

	program
		.command("research")
		.description("Full research summary for a topic")
		.argument("<topic>", "Topic to research")
		.action(async (topic) => {
			await research({ topic })
		})

	program
		.command("credits")
		.description("Check your credit balance and usage")
		.action(async () => {
			await credits()
		})

	program
		.command("login")
		.description("Authenticate with your StartupKit account")
		.action(async () => {
			await login()
		})

	program
		.command("logout")
		.description("Sign out and clear credentials")
		.action(async () => {
			await logout()
		})

	if (!process.argv.slice(2).length) {
		program.outputHelp()
		process.exit(0)
	}

	await program.parseAsync()
}

run().catch((error) => {
	console.error(error)
	process.exit(1)
})
