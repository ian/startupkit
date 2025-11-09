import { Providers } from "@/app/providers"
import { defaultMetadata } from "@/app/(seo)/metadata"
import { getFeatureFlags } from "@repo/analytics/server"
import { withAuth } from "@repo/auth/server"
import { Geist, Geist_Mono, Urbanist } from "next/font/google"
import "./globals.css"

const geistSans = Geist({
	variable: "--font-sans",
	subsets: ["latin"]
})

const urbanistSerif = Urbanist({
	variable: "--font-serif",
	subsets: ["latin"]
})

const geistMono = Geist_Mono({
	variable: "--font-mono",
	subsets: ["latin"]
})

export const metadata = defaultMetadata

export const viewport = {
	width: "device-width",
	initialScale: 1,
	maximumScale: 1,
	userScalable: "no"
}

export default async function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	const { user } = await withAuth()
	const flags = await getFeatureFlags(user?.id)

	return (
		<html lang="en">
			<body
				className={`${geistSans.variable} ${geistMono.variable} ${urbanistSerif.variable} antialiased`}
			>
				<Providers flags={flags} user={user}>
					{children}
				</Providers>
			</body>
		</html>
	)
}
