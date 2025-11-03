import "@/styles/globals.css"
import "@/styles/static.css"

import { Header } from "@/components/Header"
import { StartupKitProvider } from "@/components/StartupKitProvider"
import { cn } from "@/ui/utils"
import type { AppProps } from "next/app"
import {
	Noto_Sans_Mono as FontMono,
	Noto_Sans as FontSans,
	Bricolage_Grotesque as FontSerif
} from "next/font/google"
import { Toaster } from "react-hot-toast"

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

export default function App({ Component, pageProps, ...rest }: AppProps) {
	return (
		<StartupKitProvider>
			<main
				className={cn(fontSans.variable, fontSerif.variable, fontMono.variable)}
			>
				<Header />
				<Component {...pageProps} />
				<Toaster />
			</main>
		</StartupKitProvider>
	)
}
