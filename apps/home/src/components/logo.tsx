import { cva } from "class-variance-authority"
import Link from "next/link"
import Image from "next/image"

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

const sizeToPixels = {
	sm: 24,
	md: 40,
	lg: 64
}

interface LogoProps {
	icon?: boolean
	size?: "sm" | "md" | "lg"
}

export function Logo({ icon = false, size = "md" }: LogoProps) {
	return (
		<Link href="/" className="flex items-center">
			<Image
				src="/startupkit-logo.png"
				alt="StartupKit"
				width={sizeToPixels[size]}
				height={sizeToPixels[size]}
				className={logoVariants({ size })}
			/>
			{!icon && <span className={textVariants({ size })}>startupkit</span>}
		</Link>
	)
}
