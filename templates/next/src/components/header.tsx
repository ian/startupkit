"use client"

import { useState } from "react"
import { Container } from "@/components/container"
import { Logo } from "@repo/ui/components/logo"
import { ButtonLink } from "@repo/ui/components/button"
import { useAuth } from "@repo/auth/client"
import { getUrl, getWebUrl } from "@repo/utils"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <header className="py-6 border-b">
      {/* Desktop Header */}
      <Container className="hidden md:flex justify-center md:justify-between items-center">
        <a href="/" className="flex items-center">
          <Logo className="w-36 h-10" />
        </a>

        <div className="hidden md:flex items-center">
          {isAuthenticated ? (
            <ButtonLink
              variant="secondary"
              href={getUrl("/")}
            >
              Go to App
            </ButtonLink>
          ) : (
            <ButtonLink
              variant="secondary"
              href={getUrl("/")} target="_blank"
            >
              Get Started
            </ButtonLink>
          )}
        </div>

      </Container>

      {/* Mobile Header */}
      <Container className="md:hidden flex justify-center md:justify-between items-center">
        <a href="/" className="flex items-center">
          <Logo className="w-36 h-10" mark />
        </a>

        {/* For now there's no nav so no need for a sidebar on mobile */}
        {/* <button
          type="button"
          className="md:hidden"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          aria-label={isMenuOpen ? "Close menu" : "Open menu"}
        >
          {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button> */}
      </Container>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white z-50 border-b">
          <div className="flex flex-col p-4">
            {isAuthenticated ? (
              <ButtonLink
                href={getWebUrl("/")}
              >
                Go to App
              </ButtonLink>
            ) : (
              <ButtonLink
                href={getUrl("/")} target="_blank"
              >
                Get Started
              </ButtonLink>
            )}
          </div>
        </div>
      )}
    </header>
  )
}
