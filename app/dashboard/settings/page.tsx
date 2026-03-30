import { Metadata } from "next"
import { requireAuth } from "@/lib/queries"
import { getUserSettings } from "@/actions/settings"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { SettingsForm } from "./settings-form"

export const metadata: Metadata = {
  title: "Settings | StreakForge",
  description: "Manage your account and notification preferences",
}

export default async function SettingsPage() {
  const session = await requireAuth()
  const settings = await getUserSettings()

  if (!settings) {
    throw new Error("Failed to load user settings")
  }

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
        <SiteHeader title="Settings" />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-2xl py-8 px-4 sm:px-6">
            {/* Header */}
            <div className="mb-8">
              <h1 className="text-3xl font-black tracking-tight">Settings</h1>
              <p className="text-muted-foreground mt-1">
                Manage your account and notification preferences
              </p>
            </div>

            <SettingsForm initialSettings={settings} />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
