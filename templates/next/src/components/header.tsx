"use client"

import { useState } from "react"
import { Container } from "@/components/container"
import { Logo } from "@repo/ui/components/logo"
import { Button, ButtonLink } from "@repo/ui/components/button"
import { useAuth } from "@repo/auth"
import { LogOut, User as UserIcon } from "lucide-react"
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@repo/ui/components/dropdown-menu"

export default function Header() {
	const [isMenuOpen, setIsMenuOpen] = useState(false)
	const { isAuthenticated, user, logout } = useAuth()

	return (
		<header className="py-6 border-b">
			{/* Desktop Header */}
			<Container className="hidden md:flex justify-center md:justify-between items-center">
				<a href="/" className="flex items-center">
					<Logo className="w-36 h-10" />
				</a>

				<div className="hidden md:flex items-center gap-4">
					{isAuthenticated ? (
						<>
							<ButtonLink variant="secondary" href="/dashboard">
								Dashboard
							</ButtonLink>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="icon">
										<UserIcon className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>
										{user?.name ?? user?.email ?? "My Account"}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => logout()}>
										<LogOut className="mr-2 h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<ButtonLink variant="secondary" href="/sign-in">
							Sign In
						</ButtonLink>
					)}
				</div>
			</Container>

			{/* Mobile Header */}
			<Container className="md:hidden flex justify-center md:justify-between items-center">
				<a href="/" className="flex items-center">
					<Logo className="w-36 h-10" />
				</a>

				<div className="flex items-center gap-4">
					{isAuthenticated ? (
						<>
							<ButtonLink variant="secondary" href="/dashboard" size="sm">
								Dashboard
							</ButtonLink>
							<DropdownMenu>
								<DropdownMenuTrigger asChild>
									<Button variant="outline" size="icon">
										<UserIcon className="h-4 w-4" />
									</Button>
								</DropdownMenuTrigger>
								<DropdownMenuContent align="end">
									<DropdownMenuLabel>
										{user?.name ?? user?.email ?? "My Account"}
									</DropdownMenuLabel>
									<DropdownMenuSeparator />
									<DropdownMenuItem onClick={() => logout()}>
										<LogOut className="mr-2 h-4 w-4" />
										Sign Out
									</DropdownMenuItem>
								</DropdownMenuContent>
							</DropdownMenu>
						</>
					) : (
						<ButtonLink variant="secondary" href="/sign-in" size="sm">
							Sign In
						</ButtonLink>
					)}
				</div>
			</Container>

			{/* Mobile Navigation (kept for future use) */}
			{isMenuOpen && (
				<div className="md:hidden absolute top-16 left-0 right-0 bg-white z-50 border-b">
					<div className="flex flex-col p-4">
						{isAuthenticated ? (
							<ButtonLink href="/dashboard">Dashboard</ButtonLink>
						) : (
							<ButtonLink href="/sign-in">Sign In</ButtonLink>
						)}
					</div>
				</div>
			)}
		</header>
	)
}
