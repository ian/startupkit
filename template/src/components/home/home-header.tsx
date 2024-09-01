"use client";

import { useAuth } from "@startupkit/auth";
import clsx from "clsx";
import { motion } from "framer-motion";
import { Menu, XIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { Container } from "../container";
import { Logo } from "../logo";

const navigation = [
	{ name: "Home", href: "/" },
	{ name: "Blog", href: "/blog" },
];

export function Header() {
	const { login } = useAuth();
	const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

	return (
		<header
			className={clsx("relative z-50 w-full transition-all duration-100")}
		>
			<Container>
				<nav
					aria-label="Global"
					className="flex items-center justify-between py-6 mx-auto"
				>
					<Link href="/" className="-m-1.5 p-1.5">
						<span className="sr-only">Your Company</span>
						<Logo />
					</Link>
					<div className="flex sm:hidden">
						<button
							type="button"
							onClick={() => setMobileMenuOpen(true)}
							className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5"
						>
							<span className="sr-only">Open main menu</span>
							<Menu aria-hidden="true" className="w-6 h-6" />
						</button>
					</div>
					<div className="hidden gap-6 sm:flex">
						{navigation.map((item) => (
							<a
								key={item.name}
								href={item.href}
								className="text-sm font-semibold leading-6"
							>
								{item.name}
							</a>
						))}
						<Link
							href="/api/auth/login"
							className="text-sm font-semibold leading-6"
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</Link>
					</div>
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: mobileMenuOpen ? 1 : 0 }}
						exit={{ opacity: 0 }}
						transition={{ duration: 0.2 }}
						className={clsx(
							!mobileMenuOpen && "hidden",
							"flex flex-col w-screen h-screen bg-background/50 backdrop-blur-xl left-0 top-0 fixed p-6 sm:hidden gap-6 justify-between",
						)}
					>
						<div className="flex justify-between items-center">
							<Link href="/" className="-m-1.5 p-1.5">
								<span className="sr-only">Your Company</span>
								<Logo />
							</Link>

							<XIcon onClick={() => setMobileMenuOpen(false)} />
						</div>

						<div className="flex flex-col gap-10 mt-6 grow">
							{navigation.map((item) => (
								<a
									key={item.name}
									href={item.href}
									className="text-2xl font-medium leading-6"
									onClick={() => setMobileMenuOpen(false)}
								>
									{item.name}
								</a>
							))}
						</div>

						<button
							type="button"
							className="text-2xl font-semibold leading-6 mt-6 border rounded py-4 border-gray-300"
							onClick={login}
						>
							Log in <span aria-hidden="true">&rarr;</span>
						</button>
					</motion.div>
				</nav>
			</Container>
		</header>
	);
}
