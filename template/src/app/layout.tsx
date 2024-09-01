import "./globals.css";

import { getSession } from "@startupkit/auth/server";
import { getSubscription } from "@startupkit/payments/server";
import type { Metadata } from "next";
import { Toaster } from "react-hot-toast";

import { Providers } from "@/components/providers";

export const metadata: Metadata = {
	title: "New StartupKit App",
	description: "The SaaS Framework: https://startupkit.com",
};

export default async function RootLayout({
	children,
}: {
	children: React.ReactNode;
}) {
	const session = await getSession();
	const subscription = await getSubscription(session?.user?.id);

	return (
		<html lang="en">
			<body style={{ padding: 0, margin: 0 }}>
				<Providers session={session} subscription={subscription}>
					{children}
					<Toaster />
				</Providers>
			</body>
		</html>
	);
}
