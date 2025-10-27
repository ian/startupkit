import { cn } from "@/ui/utils"

export const Container = ({
	children,
	className
}: {
	children: React.ReactNode
	className?: string
}) => {
	return (
		<div
			className={cn(
				"w-full mx-auto md:max-w-screen-md lg:max-w-screen-lg xl:max-w-screen-xl px-4 lg:px-6",
				className
			)}
		>
			{children}
		</div>
	)
}
