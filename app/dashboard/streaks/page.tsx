import { Metadata } from "next"
import Link from "next/link"
import { Plus, Flame, Filter } from "lucide-react"
import { requireAuth, getUserStreaks } from "@/lib/queries"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { StreakCard } from "@/components/streak/StreakCard"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export const metadata: Metadata = {
  title: "My Streaks | StreakForge",
  description: "Manage all your streaks in one place",
}

export default async function StreaksPage() {
  const session = await requireAuth()
  const streaks = await getUserStreaks(session.user.id)
  const userTimezone = (session.user as { timezone?: string }).timezone ?? "UTC"

  // Filter streaks by status
  const activeStreaks = streaks.filter((s) => s.status === "ACTIVE")
  const completedStreaks = streaks.filter((s) => s.status === "COMPLETED")
  const pausedStreaks = streaks.filter((s) => s.status === "PAUSED")
  const abandonedStreaks = streaks.filter((s) => s.status === "ABANDONED")

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
        <SiteHeader title="My Streaks" />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl py-8 px-4 sm:px-6">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-black tracking-tight flex items-center gap-2">
                  <Flame className="w-8 h-8 text-orange-500" />
                  My Streaks
                </h1>
                <p className="text-muted-foreground mt-1">
                  {streaks.length} streak{streaks.length !== 1 && "s"} •{" "}
                  {activeStreaks.length} active
                </p>
              </div>
              <Button asChild>
                <Link href="/dashboard/streaks/new">
                  <Plus className="w-4 h-4 mr-2" />
                  New Streak
                </Link>
              </Button>
            </div>

            {/* Tabs for filtering */}
            <Tabs defaultValue="active" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="active" className="relative">
                  Active
                  {activeStreaks.length > 0 && (
                    <span className="ml-1.5 text-xs bg-orange-500/20 text-orange-500 px-1.5 py-0.5 rounded-full">
                      {activeStreaks.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="completed">
                  Completed
                  {completedStreaks.length > 0 && (
                    <span className="ml-1.5 text-xs bg-amber-500/20 text-amber-500 px-1.5 py-0.5 rounded-full">
                      {completedStreaks.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="paused">
                  Paused
                  {pausedStreaks.length > 0 && (
                    <span className="ml-1.5 text-xs bg-sky-500/20 text-sky-500 px-1.5 py-0.5 rounded-full">
                      {pausedStreaks.length}
                    </span>
                  )}
                </TabsTrigger>
                <TabsTrigger value="all">All</TabsTrigger>
              </TabsList>

              <TabsContent value="active" className="space-y-4">
                {activeStreaks.length === 0 ? (
                  <EmptyState
                    title="No active streaks"
                    description="Start a new streak to begin your journey!"
                    action={
                      <Button asChild>
                        <Link href="/dashboard/streaks/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Streak
                        </Link>
                      </Button>
                    }
                  />
                ) : (
                  activeStreaks.map((streak) => (
                    <StreakCard
                      key={streak.id}
                      streak={streak}
                      userTimezone={userTimezone}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="completed" className="space-y-4">
                {completedStreaks.length === 0 ? (
                  <EmptyState
                    title="No completed streaks yet"
                    description="Keep going! You'll complete your first streak soon."
                  />
                ) : (
                  completedStreaks.map((streak) => (
                    <StreakCard
                      key={streak.id}
                      streak={streak}
                      userTimezone={userTimezone}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="paused" className="space-y-4">
                {pausedStreaks.length === 0 ? (
                  <EmptyState
                    title="No paused streaks"
                    description="All your streaks are active!"
                  />
                ) : (
                  pausedStreaks.map((streak) => (
                    <StreakCard
                      key={streak.id}
                      streak={streak}
                      userTimezone={userTimezone}
                    />
                  ))
                )}
              </TabsContent>

              <TabsContent value="all" className="space-y-4">
                {streaks.length === 0 ? (
                  <EmptyState
                    title="No streaks yet"
                    description="Start your first streak to begin tracking your habits!"
                    action={
                      <Button asChild>
                        <Link href="/dashboard/streaks/new">
                          <Plus className="w-4 h-4 mr-2" />
                          Create Your First Streak
                        </Link>
                      </Button>
                    }
                  />
                ) : (
                  streaks.map((streak) => (
                    <StreakCard
                      key={streak.id}
                      streak={streak}
                      userTimezone={userTimezone}
                    />
                  ))
                )}
              </TabsContent>
            </Tabs>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}

function EmptyState({
  title,
  description,
  action,
}: {
  title: string
  description: string
  action?: React.ReactNode
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 rounded-full bg-muted/50 flex items-center justify-center mb-4">
        <Flame className="w-8 h-8 text-muted-foreground/50" />
      </div>
      <h3 className="font-semibold text-lg">{title}</h3>
      <p className="text-muted-foreground text-sm mt-1 max-w-sm">{description}</p>
      {action && <div className="mt-6">{action}</div>}
    </div>
  )
}
