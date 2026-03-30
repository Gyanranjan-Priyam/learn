import { Metadata } from "next"
import { notFound } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Calendar, Settings, Share2, TrendingUp } from "lucide-react"
import { requireAuth } from "@/lib/queries"
import { getStreakById } from "@/actions/streak"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { StreakDetailClient } from "./streak-detail-client"
import { hasCheckedInToday, getMilestoneProgress, getCompletionPercentage } from "@/lib/streak-engine"

interface StreakDetailPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: StreakDetailPageProps): Promise<Metadata> {
  const { id } = await params
  const streak = await getStreakById(id)
  
  if (!streak) {
    return { title: "Streak Not Found | StreakForge" }
  }

  return {
    title: `${streak.emoji} ${streak.name} | StreakForge`,
    description: `Track your ${streak.name} streak - ${streak.currentStreak} day streak`,
  }
}

export default async function StreakDetailPage({ params }: StreakDetailPageProps) {
  const { id } = await params
  const session = await requireAuth()
  const streak = await getStreakById(id)

  if (!streak) {
    notFound()
  }

  const userTimezone = (session.user as { timezone?: string }).timezone ?? "UTC"
  const checkedInToday = hasCheckedInToday(
    streak.checkIns.map((c) => c.date),
    userTimezone
  )
  const milestoneProgress = getMilestoneProgress(streak.currentStreak)
  const completionPercentage = getCompletionPercentage(
    streak.currentStreak,
    streak.targetDays
  )

  // Calculate stats
  const totalCheckIns = streak.checkIns.filter((c) => !c.isFrozen).length
  const freezesUsed = streak.checkIns.filter((c) => c.isFrozen).length
  const freezesRemaining = streak.freezesAllowed - streak.freezesUsed

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
        <SiteHeader title={streak.name} />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-4xl py-8 px-4 sm:px-6">
            {/* Back link & actions */}
            <div className="flex items-center justify-between mb-6">
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Link>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" asChild>
                  <Link href={`/dashboard/streaks/${streak.id}/settings`}>
                    <Settings className="w-4 h-4 mr-2" />
                    Settings
                  </Link>
                </Button>
              </div>
            </div>

            {/* Client-side interactive components */}
            <StreakDetailClient
              streak={{
                id: streak.id,
                name: streak.name,
                description: streak.description,
                emoji: streak.emoji,
                color: streak.color,
                targetDays: streak.targetDays,
                currentStreak: streak.currentStreak,
                longestStreak: streak.longestStreak,
                totalDays: streak.totalDays,
                status: streak.status,
                startDate: streak.startDate,
                freezesUsed: streak.freezesUsed,
                freezesAllowed: streak.freezesAllowed,
                checkIns: streak.checkIns.map((c) => ({
                  date: c.date,
                  isFrozen: c.isFrozen,
                  note: c.note,
                })),
                milestones: streak.milestones.map((m) => ({
                  days: m.days,
                  reachedAt: m.reachedAt,
                })),
              }}
              userTimezone={userTimezone}
              checkedInToday={checkedInToday}
              milestoneProgress={milestoneProgress}
              completionPercentage={completionPercentage}
              freezesRemaining={freezesRemaining}
            />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
