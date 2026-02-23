export default function AuthLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<div className="min-h-screen bg-background flex flex-col">
			<main className="flex-grow">{children}</main>
		</div>
	)
}
