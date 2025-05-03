import "@/styles/globals.css";
import "@/styles/static.css";

import type { AppProps } from "next/app";
import toast, { Toaster } from "react-hot-toast";
import { Header } from "@/components/Header";
import { cn } from "@/ui/utils";
import { StartupKitProvider } from "@/components/StartupKitProvider";
import {
  Bricolage_Grotesque as FontSerif,
  Noto_Sans as FontSans,
  Noto_Sans_Mono as FontMono,
} from "next/font/google";

const fontSerif = FontSerif({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const fontSans = FontSans({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontMono = FontMono({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

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
  );
}
