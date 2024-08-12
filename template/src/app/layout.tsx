import "@/styles/app.css";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "New StartupKit App",
  description: "The SaaS Framework: https://startupkit.com",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body style={{ padding: 0, margin: 0 }}>{children}</body>
    </html>
  );
}
