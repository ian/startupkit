import "./globals.css";
import type { Metadata } from "next";
import { Noto_Sans } from "next/font/google";
import { AnalyticsProvider } from "@startupkit/analytics";
import clsx from "clsx";

const font = Noto_Sans({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "StartupKit - The most complete SaaS boilerplate",
  description:
    "StartupKit is a SaaS boilerplate designed to get you launched for free, using only free partners &amp; integrations, including authentication, payments, email marketing, analytics, and more.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={clsx(font.className, "overflow-x-hidden")}>
        <AnalyticsProvider
          dataPlane={process.env.RUDDERSTACK_DATA_PLANE!}
          writeKey={process.env.RUDDERSTACK_WRITE_KEY!}
        >
          {children}
        </AnalyticsProvider>
      </body>
    </html>
  );
}
