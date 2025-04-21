"use client";

import { Toaster } from "sonner";
import { AlertProvider } from "./alert-provider";
import { ThemeProvider } from "./theme-provider";

export { useAlert } from "./alert-provider";

export function UIProvider({ children }: { children: React.ReactNode }) {
	return (
		<ThemeProvider
			attribute="class"
			defaultTheme="system"
			enableSystem
			disableTransitionOnChange
		>
			<AlertProvider>{children}</AlertProvider>
			<Toaster />
		</ThemeProvider>
	);
}
