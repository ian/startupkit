import "@/styles/app.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Example AuthKit Authenticated App",
  description: "Example Next.js application demonstrating how to use AuthKit.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ padding: 0, margin: 0 }}>
        <main className="p-5">{children}</main>
      </body>
    </html>
  );
}
