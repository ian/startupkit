"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo } from "react";
import { UIProvider } from "@brokerbot/ui/providers"
import { AnalyticsProvider } from "@brokerbot/analytics/react";
import type { Flags } from "@brokerbot/analytics/server";
import { toast } from "@brokerbot/ui/components/toast"
import { AuthProvider, User } from "@brokerbot/auth/client";

export function Providers({
	children,
	flags,
	user
}: {
	children: React.ReactNode;
	flags: Flags;
	user?: User
}) {
	const { replace, refresh } = useRouter();
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
			<AuthProvider user={user}>
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
