import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import * as React from "react";

import { cn } from "@/lib/utils";
import Link from "next/link";
import { LoadingDots } from "./loading";

const buttonVariants = cva(
	"inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
	{
		variants: {
			variant: {
				default: "bg-primary text-primary-foreground hover:bg-primary/90",
				destructive:
					"bg-destructive text-destructive-foreground hover:bg-destructive/90",
				outline:
					"border border-input bg-background hover:bg-accent hover:text-accent-foreground",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-10 px-4 py-2",
				sm: "h-9 rounded-md px-3",
				lg: "h-11 rounded-md px-8",
				icon: "h-10 w-10",
			},
		},
		defaultVariants: {
			variant: "default",
			size: "default",
		},
	},
);

export interface ButtonProps
	extends React.ButtonHTMLAttributes<HTMLButtonElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{ className, variant, size, asChild = false, children, loading, ...props },
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }), "relative")}
				ref={ref}
				disabled={loading}
				{...props}
			>
				{loading ? (
					<span
						className={cn(
							buttonVariants({ variant }),
							"absolute w-full h-full flex items-center justify-center",
						)}
					>
						<LoadingDots />
					</span>
				) : null}
				{children}
			</Comp>
		);
	},
);

Button.displayName = "Button";

export interface ButtonLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement>,
		VariantProps<typeof buttonVariants> {
	asChild?: boolean;
	loading?: boolean;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	(
		{
			className,
			variant,
			size,
			href,
			asChild = false,
			children,
			loading,
			...props
		},
		ref,
	) => {
		return (
			<Link
				className={cn(buttonVariants({ variant, size, className }), "relative")}
				ref={ref}
				href={href as string}
				{...props}
			>
				{loading ? (
					<span
						className={cn(
							buttonVariants({ variant }),
							"absolute w-full h-full flex items-center justify-center",
						)}
					>
						<LoadingDots />
					</span>
				) : null}
				{children}
			</Link>
		);
	},
);

ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink, buttonVariants };
