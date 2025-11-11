import React from "react"
import { cn } from "@repo/ui/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
	children: React.ReactNode
	className?: string
	as?: React.ElementType
}

export function Container({
	children,
	className,
	as: Component = "div",
	...props
}: ContainerProps) {
	return (
		<Component
			className={cn(
				"container mx-auto px-4 sm:px-6 lg:px-8 max-w-7xl",
				className
			)}
			{...props}
		>
			{children}
		</Component>
	)
}
