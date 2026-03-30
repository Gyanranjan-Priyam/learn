import { Metadata } from "next"
import { redirect } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { requireAuth } from "@/lib/queries"
import { StreakForm } from "@/components/streak/StreakForm"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

export const metadata: Metadata = {
  title: "New Streak | StreakForge",
  description: "Create a new streak to track your daily habits",
}

export default async function NewStreakPage() {
  const session = await requireAuth()
  
  return (
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        user={{
          name: session.user.name || "User",
          email: session.user.email,
          image: session.user.image || undefined,
        }}
      />
      <SidebarInset>
        <SiteHeader title="New Streak" />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-2xl py-8 px-4 sm:px-6">
            {/* Back link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Dashboard
            </Link>

            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight">
                Start a New Streak 🔥
              </h1>
              <p className="text-muted-foreground mt-2">
                Create a daily habit and watch your consistency grow.
              </p>
            </div>

            {/* Form */}
            <StreakForm mode="create" />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
