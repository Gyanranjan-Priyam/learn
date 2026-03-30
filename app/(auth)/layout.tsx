import Link from "next/link"
import { Flame } from "lucide-react"
import { ThemeToggle } from "@/components/shared/ThemeToggle"

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative flex min-h-screen flex-col bg-white dark:bg-neutral-950">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(251,146,60,0.06),transparent_50%)]" />
      
      {/* Header */}
      <header className="relative z-10 flex h-16 items-center justify-between px-6">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-orange-500">
            <Flame className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            StreakForge
          </span>
        </Link>
        <ThemeToggle />
      </header>

      {/* Main content */}
      <main className="relative z-10 flex flex-1 items-center justify-center px-6 py-12">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-6 text-center text-sm text-neutral-500 dark:text-neutral-400">
        © {new Date().getFullYear()} StreakForge. All rights reserved.
      </footer>
    </div>
  )
}
