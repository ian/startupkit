import { Container } from "@/components/container"
import { ButtonLink } from "@repo/ui/components/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@repo/ui/components/card"
import { Lock, LayoutDashboard, Mail, Chrome } from "lucide-react"

export default function Home() {
  return (
		<Container className="py-12">
			<div className="space-y-12">
				<div className="text-center space-y-4">
					<h1 className="text-4xl font-bold">Welcome to StartupKit</h1>
					<p className="text-xl text-muted-foreground">
						A modern SaaS template with authentication built-in
					</p>
				</div>

				<div className="grid gap-6 md:grid-cols-2">
					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<Lock className="h-5 w-5" />
								Authentication
							</CardTitle>
							<CardDescription>
								Try out the authentication features
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<div className="space-y-2">
								<div className="flex items-center gap-2">
									<Mail className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Email OTP sign-in</span>
								</div>
								<div className="flex items-center gap-2">
									<Chrome className="h-4 w-4 text-muted-foreground" />
									<span className="text-sm">Google OAuth</span>
								</div>
							</div>
							<ButtonLink href="/sign-in" className="w-full">
								Sign In
							</ButtonLink>
						</CardContent>
					</Card>

					<Card>
						<CardHeader>
							<CardTitle className="flex items-center gap-2">
								<LayoutDashboard className="h-5 w-5" />
								Protected Routes
							</CardTitle>
							<CardDescription>
								See server-side authentication in action
							</CardDescription>
						</CardHeader>
						<CardContent className="space-y-4">
							<p className="text-sm text-muted-foreground">
								The dashboard is a protected route that requires authentication.
								Sign in first to access it.
							</p>
							<ButtonLink href="/dashboard" variant="outline" className="w-full">
								View Dashboard
							</ButtonLink>
						</CardContent>
					</Card>
				</div>

				<Card>
					<CardHeader>
						<CardTitle>Features Included</CardTitle>
						<CardDescription>
							This template demonstrates StartupKit authentication patterns
						</CardDescription>
					</CardHeader>
					<CardContent>
						<ul className="space-y-2">
							<li className="flex items-start gap-2">
								<span className="text-primary">✓</span>
								<span className="text-sm">
									<strong>Email OTP Authentication:</strong> Passwordless sign-in
									with one-time codes
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary">✓</span>
								<span className="text-sm">
									<strong>Google OAuth:</strong> Sign in with Google account
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary">✓</span>
								<span className="text-sm">
									<strong>Protected Routes:</strong> Server-side authentication
									checks
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary">✓</span>
								<span className="text-sm">
									<strong>Session Management:</strong> 7-day sessions with
									auto-refresh
								</span>
							</li>
							<li className="flex items-start gap-2">
								<span className="text-primary">✓</span>
								<span className="text-sm">
									<strong>User Context:</strong> Access user data in client and
									server components
								</span>
							</li>
						</ul>
					</CardContent>
				</Card>
			</div>
		</Container>
	)
}
