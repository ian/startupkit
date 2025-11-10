import { defaultMetadata } from "@/app/(seo)/metadata"
import {
	Noto_Sans_Mono as FontMono,
	Noto_Sans as FontSans,
	Bricolage_Grotesque as FontSerif
} from "next/font/google"
import "@/styles/globals.css"
import { Header } from "@/components/Header"
import { StartupKitProvider } from "@/components/StartupKitProvider"
import { cn } from "@/ui/utils"

const fontSerif = FontSerif({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-serif"
})

const fontSans = FontSans({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-sans"
})

const fontMono = FontMono({
	subsets: ["latin"],
	display: "swap",
	variable: "--font-mono"
})

export const metadata = defaultMetadata

export default function RootLayout({
	children
}: Readonly<{
	children: React.ReactNode
}>) {
	return (
		<html lang="en">
			<body
				className={cn(
					"min-h-screen bg-background font-sans antialiased",
					fontSans.variable,
					fontSerif.variable,
					fontMono.variable
				)}
			>
				<StartupKitProvider>
					<Header />
					<main>{children}</main>
				</StartupKitProvider>
			</body>
		</html>
	)
}
