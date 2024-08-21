"use client";

import "@/styles/pages.css";

import type { AppProps } from "next/app";
import { Header } from "@/components/home-header";
import { cn } from "@/components/ui/utils";
import {
  Bricolage_Grotesque as FontSerif,
  Noto_Sans as FontSans,
  Noto_Sans_Mono as FontMono,
} from "next/font/google";
import { Footer } from "@/components/home-footer";
import { ClientProviders } from "@/components/client-providers";
import Head from "next/head";

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

export default function StaticPages({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>StartupKit - Everything you need to launch a SaaS product</title>
        <meta
          name="description"
          content="Built using modern open-source frameworks and packed full of integrations, StartupKit provides everything you need to build, grow, and scale your startup."
        />
        <link rel="canonical" href="https://startupkit.com" />
        <link rel="manifest" href="/site.webmanifest" />
        <link
          rel="apple-touch-icon"
          sizes="180x180"
          href="/apple-touch-icon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/favicon-32x32.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/favicon-16x16.png"
        />
      </Head>
      <main
        className={cn(
          fontSans.variable,
          fontSerif.variable,
          fontMono.variable,
          "justify-between flex flex-col w-full",
        )}
      >
        <ClientProviders>
          <Header />
          <main className="px-4 mx-auto lg:px-6 md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl">
            <Component {...pageProps} />
          </main>
          <Footer />
        </ClientProviders>
      </main>
    </>
  );
}
