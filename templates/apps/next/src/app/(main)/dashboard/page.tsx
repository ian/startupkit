import { Container } from "@/components/container"
import { withAuth } from "@repo/auth/server"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { redirect } from "next/navigation"

export default async function DashboardPage() {
	const { user, session } = await withAuth()

	if (!user) {
		redirect("/sign-in")
	}

	return (
		<Container className="py-12">
			<div className="space-y-6">
				<div>
					<h1 className="text-3xl font-bold">Dashboard</h1>
					<p className="text-muted-foreground">Welcome back to your dashboard</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle>User Information</CardTitle>
							<CardDescription>Your account details</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<span className="font-semibold">Name:</span> {user.name ?? "Not set"}
							</div>
							<div>
								<span className="font-semibold">Email:</span> {user.email}
							</div>
							<div>
								<span className="font-semibold">User ID:</span> {user.id}
							</div>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle>Session Information</CardTitle>
							<CardDescription>Your current session details</CardDescription>
						</CardHeader>
						<CardContent className="space-y-2">
							<div>
								<span className="font-semibold">Session ID:</span>{" "}
								{session?.id ?? "No session"}
							</div>
							<div>
								<span className="font-semibold">Expires:</span>{" "}
								{session?.expiresAt 
									? new Date(session.expiresAt).toLocaleString()
									: "Unknown"}
							</div>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Protected Content</CardTitle>
						<CardDescription>
							This is a protected route that requires authentication
						</CardDescription>
					</CardHeader>
					<CardContent>
						<p>
							This page demonstrates server-side authentication protection. Only
							authenticated users can access this content. If you're seeing this,
							you've successfully signed in!
						</p>
					</CardContent>
				</Card>
			</div>
		</Container>
	)
}

