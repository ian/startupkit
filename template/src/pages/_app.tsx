import "@/styles/pages.css";

import type { AppProps } from "next/app";
import { Header } from "@/components/home/Header";
import { cn } from "@/ui/utils";
import {
  Bricolage_Grotesque as FontSerif,
  Noto_Sans as FontSans,
  Noto_Sans_Mono as FontMono,
} from "next/font/google";
import { Footer } from "@/components/home/Footer";

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
      className={cn(
        fontSans.variable,
        fontSerif.variable,
        fontMono.variable,
        "justify-between flex flex-col w-full",
      )}
    >
      <Header />
      <main className="px-4 mx-auto lg:px-6 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
        <Component {...pageProps} />
      </main>
      <Footer />
    </main>
  );
}
