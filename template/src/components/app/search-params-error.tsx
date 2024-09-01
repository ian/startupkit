"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useLayoutEffect } from "react";
import toast from "react-hot-toast";

export const SearchParamsError = () => {
	const router = useRouter();
	const pathname = usePathname();
	const searchParams = useSearchParams();

	useLayoutEffect(() => {
		if (!searchParams) {
			return;
		}

		const error = searchParams?.get("error");

		if (error) {
			const {
				error: _,
				error_description: __,
				...params
			} = Object.fromEntries(searchParams); // Destructure to remove error

			toast.error(error);

			const url = [pathname, new URLSearchParams(params).toString()]
				.filter((f) => f !== "")
				.join("?");

			router.replace(url);
		}
	});

	return null;
};
