import { Slot } from "@radix-ui/react-slot";
import { type VariantProps, cva } from "class-variance-authority";
import Link from "next/link";
import * as React from "react";
import { cn } from "../lib/utils";

const buttonVariants = cva(
	cn(
		"inline-flex items-center gap-1 justify-center whitespace-nowrap font-medium ring-offset-background transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
		"focus-visible:outline-none focus-visible:ring-none",
		// "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ",
	),
	{
		variants: {
			variant: {
				default:
					"bg-black text-white dark:bg-white dark:text-black hover:bg-foreground/90 border border-black dark:border-white",
				success: "bg-green-500 text-white hover:bg-green-600",
				destructive:
					"bg-destructive dark:bg-destructive text-destructive-foreground hover:bg-destructive/90 dark:hover:bg-destructive/90",
				primary: "bg-primary text-primary-foreground hover:bg-primary/90",
				"primary-outline":
					"border-2 text-primary border-primary bg-transparent hover:bg-accent",
				secondary:
					"bg-secondary text-secondary-foreground hover:bg-secondary/80",
				outline:
					"border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
				ghost: "hover:bg-accent hover:text-accent-foreground",
				link: "text-primary underline-offset-4 hover:underline",
			},
			size: {
				default: "h-11 rounded-md px-4 py-2",
				xs: "h-6 rounded-sm px-1.5",
				sm: "h-9 rounded-md px-3",
				lg: "h-12 rounded-md text-lg px-6",
				xl: "h-16 rounded-md text-xl px-8",
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
	icon?: React.ReactNode;
	iconPosition?: "start" | "end";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
	(
		{
			className,
			variant,
			size,
			asChild = false,
			loading = false,
			icon,
			children,
			...props
		},
		ref,
	) => {
		const Comp = asChild ? Slot : "button";
		return (
			<Comp
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				disabled={loading || props.disabled}
				{...props}
			>
				{loading ? (
					<>
						<svg
							className="animate-spin ml-1"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24"
							width="1em"
							height="1em"
						>
							<title>Loading...</title>
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
						{children}
					</>
				) : (
					<>
						{icon}
						{children}
					</>
				)}
			</Comp>
		);
	},
);
Button.displayName = "Button";

interface ButtonLinkProps
	extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
	href: string;
	variant?: VariantProps<typeof buttonVariants>["variant"];
	size?: VariantProps<typeof buttonVariants>["size"];
	icon?: React.ReactNode;
}

const ButtonLink = React.forwardRef<HTMLAnchorElement, ButtonLinkProps>(
	({ className, href, variant, size, icon, children, ...props }, ref) => {
		return (
			<Link
				href={href}
				className={cn(buttonVariants({ variant, size, className }))}
				ref={ref}
				{...props}
			>
				{icon}
				{children}
			</Link>
		);
	},
);

ButtonLink.displayName = "ButtonLink";

export { Button, ButtonLink, buttonVariants };
