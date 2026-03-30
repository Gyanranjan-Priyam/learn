"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/shared/ThemeToggle"
import { Flame, Menu, X } from "lucide-react"

const navLinks = [
  { name: "Features", href: "#features" },
  { name: "How It Works", href: "#how-it-works" },
  { name: "Testimonials", href: "#testimonials" },
  { name: "Pricing", href: "#pricing" },
]

export function Navbar() {
  const [isOpen, setIsOpen] = useState(false)

  const toggleMenu = () => setIsOpen(!isOpen)
  const closeMenu = () => setIsOpen(false)

  // Prevent body scroll when menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }
    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-neutral-200 bg-white backdrop-blur supports-[backdrop-filter]:bg-white/95 dark:border-neutral-800 dark:bg-neutral-950 dark:supports-[backdrop-filter]:bg-neutral-950/95">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
              <Flame className="h-5 w-5 text-white" />
            </div>
            <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
              StreakForge
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden items-center gap-8 md:flex">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-sm font-medium text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-2 md:flex">
            <ThemeToggle />
            <Button variant="ghost" className="text-sm font-medium" asChild>
              <Link href="/signin">Sign In</Link>
            </Button>
            <Button className="bg-neutral-900 text-sm font-medium text-white hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-neutral-200" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="h-9 w-9"
              onClick={toggleMenu}
              aria-label="Toggle menu"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-[60] bg-black/60 md:hidden"
          onClick={closeMenu}
          aria-hidden="true"
        />
      )}

      {/* Mobile Menu Panel */}
      <div
        className={`fixed right-0 top-0 z-[70] flex h-full w-[280px] flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out dark:bg-neutral-900 md:hidden ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {/* Menu Header */}
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-neutral-200 px-6 dark:border-neutral-800">
          <span className="text-lg font-semibold text-neutral-900 dark:text-white">
            Menu
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9"
            onClick={closeMenu}
            aria-label="Close menu"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Menu Content */}
        <div className="flex-1 overflow-y-auto">
          <nav className="flex flex-col px-6 py-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={closeMenu}
                className="border-b border-neutral-100 py-4 text-base font-medium text-neutral-900 hover:text-orange-500 dark:border-neutral-800 dark:text-white dark:hover:text-orange-400"
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>

        {/* Menu Footer */}
        <div className="shrink-0 border-t border-neutral-200 p-6 dark:border-neutral-800">
          <div className="flex flex-col gap-3">
            <Button
              variant="outline"
              className="w-full justify-center border-neutral-300 dark:border-neutral-700"
              asChild
            >
              <Link href="/signin" onClick={closeMenu}>
                Sign In
              </Link>
            </Button>
            <Button
              className="w-full justify-center bg-orange-500 text-white hover:bg-orange-600"
              asChild
            >
              <Link href="/signup" onClick={closeMenu}>
                Get Started
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </>
  )
}
