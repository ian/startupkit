"use client";

import { Toaster } from "sonner";
import { AlertProvider } from "./alert-provider";
import { ThemeProvider } from "./theme-provider";
import { ThemeProviderProps } from "next-themes/dist/types";

export { useAlert } from "./alert-provider";

const defaultThemeProviderProps: Omit<ThemeProviderProps, "children"> = {
	attribute: "class",
	defaultTheme: "system",
	enableSystem: true,
	disableTransitionOnChange: true,
}

export function UIProvider({ children, ...themeProps }: ThemeProviderProps) {
	return (
		<ThemeProvider
			{...defaultThemeProviderProps}
			{...themeProps}
		>
			<AlertProvider>{children}</AlertProvider>
			<Toaster />
		</ThemeProvider>
	);
}
