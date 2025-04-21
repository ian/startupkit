import type React from "react"
import { fromE164 } from "../../lib/phone"
import { cn } from "../../lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "../avatar/avatar"

export interface UserLockupProps {
	firstName: string
	lastName: string
	email: string
	phone: string
	avatar?: string | null
	size?: "sm" | "md" | "lg"
	badge?: React.ReactNode
	className?: string
}

export function UserLockup({
	avatar = null,
	badge,
	className,
	firstName,
	lastName,
	email,
	phone,
	size = "md"
}: UserLockupProps) {
	const name = [firstName, lastName].filter((f) => f).join(" ")

	const avatarSizes = {
		sm: "w-6 h-6 text-xs",
		md: "w-8 h-8 text-sm",
		lg: "w-10 h-10 text-base"
	}

	const textSizes = {
		sm: "text-xs",
		md: "text-sm",
		lg: "text-base"
	}

	return (
		<div className={cn("flex items-center gap-3", className)}>
			<Avatar className={cn("rounded-md", avatarSizes[size])}>
				{avatar && (
					<AvatarImage
						src={avatar}
						alt={name || email}
						className="object-cover"
					/>
				)}
				<AvatarFallback label={name || email} />
			</Avatar>
			<div>
				{name.length > 0 ? (
					<>
						<div className="font-medium">
							{name}
							{badge && <span className="ml-2">{badge}</span>}
						</div>
						<div className={cn(textSizes[size], "text-muted-foreground")}>
							{email || (phone ? fromE164(phone) : null)}
						</div>
					</>
				) : (
					<div className={cn(textSizes[size], "")}>
						{email || (phone ? fromE164(phone) : null)}
						{badge && <span className="ml-2">{badge}</span>}
					</div>
				)}
			</div>
		</div>
	)
}
