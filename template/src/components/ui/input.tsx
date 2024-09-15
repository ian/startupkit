import * as React from "react";

import { cn } from "@/lib/utils";

export interface InputProps
	extends React.InputHTMLAttributes<HTMLInputElement | HTMLTextAreaElement> {
	as?: "input" | "textarea";
}

const Input = React.forwardRef<
	HTMLInputElement | HTMLTextAreaElement,
	InputProps
>(({ className, type, as = "input", ...props }, ref) => {
	const refType = React.useRef<HTMLInputElement | HTMLTextAreaElement>(null); // Unified ref type

	if (as === "textarea") {
		return (
			<textarea
				className={cn(
					"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
					className,
				)}
				ref={refType as React.Ref<HTMLTextAreaElement>}
				{...props}
			/>
		);
	}

	return (
		<input
			type={type}
			className={cn(
				"flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
				className,
			)}
			ref={refType as React.Ref<HTMLInputElement>}
			{...props}
		/>
	);
});

Input.displayName = "Input";

export { Input };
