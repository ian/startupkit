"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

const navigation = [
  { name: "Product", href: "/#product" },
  { name: "Features", href: "/#features" },
  { name: "Blog", href: "/blog" },
];

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="relative z-50 w-full">
      <nav
        aria-label="Global"
        className="flex items-center justify-between p-6 mx-auto max-w-7xl lg:px-8"
      >
        <Link href="/" className="-m-1.5 p-1.5">
          <span className="sr-only">Your Company</span>
          <Image
            alt=""
            src="/startupkit-light.svg"
            width={363}
            height={100}
            className="w-auto h-10"
          />
        </Link>
        <div className="flex sm:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(true)}
            className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
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
              className="text-sm font-semibold leading-6 text-gray-900"
            >
              {item.name}
            </a>
          ))}
          <Link
            href="/api/auth/login"
            className="text-sm font-semibold leading-6 text-gray-900"
          >
            Log in <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </nav>
    </header>
  );
}
