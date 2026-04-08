import Link from "next/link"
import { redirect } from "next/navigation"

// Mock auth for development - replace with actual auth when integrated
interface MockUser {
	email: string
	plan: string
}

interface MockSession {
	user: MockUser | null
	session: null
}

async function getSession(): Promise<MockSession> {
	return {
		user: { email: "user@example.com", plan: "starter" },
		session: null
	}
}

export default async function ProLayout({
	children
}: {
	children: React.ReactNode
}) {
	const { user } = await getSession()

	if (!user) {
		redirect("/auth/sign-in")
	}

	return (
		<div className="min-h-screen bg-zinc-950 text-white">
			<header className="border-b border-zinc-800">
				<div className="mx-auto max-w-7xl px-4 py-4">
					<nav className="flex items-center justify-between">
						<Link href="/pro" className="text-xl font-bold">
							StartupKit Pro
						</Link>
						<div className="flex items-center gap-6">
							<Link
								href="/pro"
								className="text-zinc-400 transition-colors hover:text-white"
							>
								Dashboard
							</Link>
							<Link
								href="/pro/credits"
								className="text-zinc-400 transition-colors hover:text-white"
							>
								Credits
							</Link>
							<Link
								href="/pro/api-keys"
								className="text-zinc-400 transition-colors hover:text-white"
							>
								API Keys
							</Link>
							<Link
								href="/pro/settings"
								className="text-zinc-400 transition-colors hover:text-white"
							>
								Settings
							</Link>
						</div>
						<div className="text-sm text-zinc-400">{user?.email}</div>
					</nav>
				</div>
			</header>
			<main className="mx-auto max-w-7xl px-4 py-8">{children}</main>
		</div>
	)
}
