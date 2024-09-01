import { Menu, Search } from "lucide-react";

import { Sidebar } from "@/components/app/app-sidebar";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLink,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
	type SessionUser,
	clearSession,
	getUser,
} from "@startupkit/auth/server";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

export const Header = async () => {
	const { user } = await getUser();

	return (
		<header className="flex h-14 items-center gap-4 bg-background border-b px-4 lg:h-[60px] lg:px-6">
			<Sheet>
				<SheetTrigger asChild>
					<Button variant="outline" size="icon" className="shrink-0 md:hidden">
						<Menu className="w-5 h-5" />
						<span className="sr-only">Toggle navigation menu</span>
					</Button>
				</SheetTrigger>
				<SheetContent side="left" className="flex flex-col">
					<Sidebar className="text-lg font-medium" />
				</SheetContent>
			</Sheet>
			<div className="flex-1 w-full">
				<form>
					<div className="relative">
						<Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
						<Input
							type="search"
							placeholder="Search products..."
							className="w-full pl-8 shadow-none appearance-none md:w-2/3 lg:w-1/3"
						/>
					</div>
				</form>
			</div>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button variant="secondary" size="icon" className="rounded-full">
						<Avatar>
							<AvatarImage src={user?.avatarUrl ?? undefined} />
							<AvatarFallback>{getInitials(user)}</AvatarFallback>
						</Avatar>
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="end">
					<DropdownMenuLink href="/account">
						<Link href="/account">My Account</Link>
					</DropdownMenuLink>
					<DropdownMenuSeparator />
					<DropdownMenuLink href="/billing">Billing</DropdownMenuLink>
					<DropdownMenuSeparator />
					<DropdownMenuItem>
						<form
							action={async () => {
								"use server";
								await clearSession();
							}}
						>
							<button type="submit">Sign Out</button>
						</form>
					</DropdownMenuItem>
				</DropdownMenuContent>
			</DropdownMenu>
		</header>
	);
};

function getInitials(user: SessionUser | null): string {
	if (!user) return "";
	const firstInitial = user.firstName?.charAt(0).toUpperCase();
	const lastInitial = user.lastName?.charAt(0).toUpperCase();
	return [firstInitial, lastInitial].join("");
}
