"use client";

import { Home, LineChart, Package, ShoppingCart, Users } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import clsx from "clsx";
import Image from "next/image";

import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { useSubscription } from "@startupkit/payments";
import { usePathname } from "next/navigation";
import { Button, ButtonLink } from "../ui/button";

const LINKS = [
	{
		label: "Dashboard",
		href: "/dash",
		icon: Home,
	},
	{
		label: "Orders",
		href: "#",
		icon: ShoppingCart,
		badge: 6,
	},
	{
		label: "Products",
		href: "#",
		icon: Package,
	},
	{
		label: "Customers",
		href: "#",
		icon: Users,
	},
	{
		label: "Analytics",
		href: "#",
		icon: LineChart,
	},
];

export const Sidebar = ({ className }: { className?: string }) => {
	const pathname = usePathname();
	const { subscription } = useSubscription();

	return (
		<section
			className={clsx("flex flex-col justify-between h-full", className)}
		>
			<nav className={clsx("grid gap-2")}>
				<Link
					href="/dash"
					className="flex items-center gap-2 text-lg font-semibold sm:hidden"
				>
					<Image
						alt="StartupKit"
						src="/startupkit-logo.svg"
						className="w-auto h-10 -ml-2"
						width={100}
						height={100}
					/>
					<span className="sr-only">StartupKit</span>
				</Link>

				{LINKS.map((link) => (
					<Link
						key={link.label}
						href={link.href}
						className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground hover:bg-slate-50"
					>
						<link.icon className="w-5 h-5" />
						{link.label}
						{link.badge ? (
							<Badge className="flex items-center justify-center w-6 h-6 ml-auto rounded-full shrink-0">
								{link.badge}
							</Badge>
						) : null}
					</Link>
				))}
			</nav>
			{pathname !== "/billing" && !subscription ? (
				<div className="mt-auto">
					<Card>
						<CardHeader>
							<CardTitle>Upgrade to Pro</CardTitle>
							<CardDescription>
								Unlock all features and get unlimited access to our support
								team.
							</CardDescription>
						</CardHeader>
						<CardContent>
							<ButtonLink size="sm" className="w-full" href="/billing">
								Upgrade
							</ButtonLink>
						</CardContent>
					</Card>
				</div>
			) : null}
		</section>
	);
};
