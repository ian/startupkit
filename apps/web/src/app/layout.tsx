import { Providers } from "@/app/providers"
import { metadata as defaultMetadata } from "@/lib/metadata"
import { getFeatureFlags } from "@repo/analytics/server"
import { Inter } from "next/font/google"
import "./globals.css"

const inter = Inter({
	variable: "--font-sans",
	subsets: ["latin"],
	weight: ["300", "400", "500", "600", "700"]
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
	const flags = await getFeatureFlags()

	return (
		<html lang="en" className="dark">
			<body className={`${inter.variable} font-sans antialiased`}>
				<Providers flags={flags}>{children}</Providers>
			</body>
		</html>
	)
}
