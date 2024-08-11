import "@/styles/globals.css";
import "@/styles/static.css";

import type { AppProps } from "next/app";
import { Header } from "@/components/home/Header";
import { cn } from "@/ui/utils";
import {
  Bricolage_Grotesque as FontSerif,
  Noto_Sans as FontSans,
  Noto_Sans_Mono as FontMono,
} from "next/font/google";

const fontSerif = FontSerif({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-serif",
});

const fontSans = FontSans({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

const fontMono = FontMono({
  weight: "400",
  subsets: ["latin"],
  display: "swap",
  variable: "--font-mono",
});

export default function App({ Component, pageProps, ...rest }: AppProps) {
  return (
    <main
      className={cn(fontSans.variable, fontSerif.variable, fontMono.variable)}
    >
      <Header />
      <Component {...pageProps} />
    </main>
  );
}
