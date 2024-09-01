"use client";

import "@/styles/pages.css";

import { NextPage } from "next";
import type { AppProps } from "next/app";
import Head from "next/head";
import {
  Bricolage_Grotesque as FontSerif,
  Noto_Sans as FontSans,
  Noto_Sans_Mono as FontMono,
} from "next/font/google";

import { Header } from "@/components/home/home-header";
import { cn } from "@/components/ui/utils";
import { Footer } from "@/components/home/home-footer";
import { Container } from "@/components/container";
import { Providers } from "@/components/providers";

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

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: React.ReactElement) => React.ReactNode;
};

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout;
};

export default function StaticApp({
  Component,
  pageProps,
}: AppPropsWithLayout) {
  const getLayout =
    Component.getLayout ??
    ((page) => (
      <>
        <Header />
        <Container>
          <main>{page}</main>
        </Container>
        <Footer />
      </>
    ));

  const content = getLayout(<Component {...pageProps} />);

  return (
    <>
      <Head>
        <title>Inboxy - Open Source Communications API</title>
        <meta name="description" content="TODO - ADD META DESCRIPTION" />
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
          "justify-between flex flex-col w-full min-h-screen font-sans antialiased mx-auto overflow-x-hidden",
        )}
      >
        <Providers>{content}</Providers>
      </main>
    </>
  );
}
