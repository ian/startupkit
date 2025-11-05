"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { UIProvider } from "@repo/ui/providers"
import { AnalyticsProvider } from "@repo/analytics";
import type { Flags } from "@repo/analytics/server";
import { toast } from "@repo/ui/components/toast"
import { AuthProvider, authClient, type User } from "@repo/auth";

export function Providers({
	children,
	flags,
	user
}: {
	children: React.ReactNode;
	flags: Flags;
	user?: User
}) {
	const { replace } = useRouter();
	const searchParams = useSearchParams();

	const params = useMemo(
		() => Object.fromEntries(searchParams.entries()),
		[searchParams],
	);

	useEffect(() => {
		const { error, ...queryParams } = params;

		if (error) {
			const newQueryParams = new URLSearchParams(
				queryParams as Record<string, string>,
			).toString();
			toast.error(getErrorMessage(error));
			const newUrl = `${window.location.pathname}${newQueryParams ? `?${newQueryParams}` : ""}`;
			replace(newUrl);
		}
	}, [replace, params]);

	return (
		<UIProvider
			themes={["light"]}
			defaultTheme="light"
			forcedTheme="light"
		>
			<AuthProvider user={user} authClient={authClient}>
				<AnalyticsProvider flags={flags}>{children}</AnalyticsProvider>
			</AuthProvider>
		</UIProvider>
	);
}

const getErrorMessage = (error: string) => {
	if (error === "AUTH_FAILED") {
		return "Authentication failed. Please try again.";
	}
	return error;
};
