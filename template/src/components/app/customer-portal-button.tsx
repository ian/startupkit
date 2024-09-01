"use client";

import { usePortal } from "@startupkit/payments";
import { useState } from "react";
import { Button, type ButtonProps } from "./ui/button";

export function CustomerPortalButton(props: ButtonProps) {
	const [isSubmitting, setSubmitting] = useState(false);
	const { redirectToPortal } = usePortal();

	const handleStripePortalRequest = async () => {
		setSubmitting(true);
		redirectToPortal();
	};

	return (
		<Button
			{...props}
			onClick={handleStripePortalRequest}
			loading={isSubmitting}
		/>
	);
}
