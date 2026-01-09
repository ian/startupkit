import { cva } from "class-variance-authority"
import { Link } from "react-router-dom"

const logoVariants = cva("w-auto", {
	variants: {
		size: {
			sm: "h-6",
			md: "h-10",
			lg: "h-16"
		}
	},
	defaultVariants: {
		size: "md"
	}
})

const textVariants = cva("font-semibold", {
	variants: {
		size: {
			sm: "text-base",
			md: "text-lg",
			lg: "text-xl"
		}
	},
	defaultVariants: {
		size: "md"
	}
})

interface LogoProps {
	icon?: boolean
	size?: "sm" | "md" | "lg"
}

export function Logo({ icon = false, size = "md" }: LogoProps) {
	return (
		<Link to="/" className="flex items-center">
			<img
				src="/startupkit-logo.png"
				alt="StartupKit"
				className={logoVariants({ size })}
			/>
			{!icon && <span className={textVariants({ size })}>startupkit</span>}
		</Link>
	)
}
