"use client"

import Link from "next/link"
import { format, formatDistanceToNow } from "date-fns"
import { 
  FlameIcon, 
  TrophyIcon, 
  CalendarCheckIcon, 
  ZapIcon,
  PlusIcon,
  ArrowRightIcon,
  SparklesIcon
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

interface DashboardContentProps {
  user: {
    id: string
    name: string
    email: string
    image?: string | null
  }
  stats: {
    activeStreaks: number
    totalCheckIns: number
    completedStreaks: number
    longestActiveStreak: number
    longestStreakName: string | null
  }
  streaks: Array<{
    id: string
    name: string
    description: string | null
    targetDays: number
    color: string
    emoji: string
    status: string
    currentStreak: number
    longestStreak: number
    totalDays: number
    startDate: Date
    checkIns: Array<{ date: Date; note: string | null }>
  }>
  recentActivity: Array<{
    id: string
    date: Date
    note: string | null
    createdAt: Date
    streak: {
      name: string
      emoji: string
      color: string
    }
  }>
}

export function DashboardContent({ user, stats, streaks, recentActivity }: DashboardContentProps) {
  const firstName = user.name.split(" ")[0]
  const activeStreaks = streaks.filter(s => s.status === "ACTIVE")
  const hour = new Date().getHours()
  const greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening"

  return (
    <div className="flex flex-1 flex-col">
      <div className="flex flex-1 flex-col gap-6 p-4 lg:p-6">
        {/* Welcome Section */}
        <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-orange-500 via-orange-400 to-amber-500 p-6 text-white shadow-lg lg:p-8">
          <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="absolute -bottom-10 -left-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
          <div className="relative">
            <p className="text-orange-100">{greeting},</p>
            <h1 className="mt-1 text-2xl font-bold lg:text-3xl">{firstName}! 👋</h1>
            <p className="mt-2 max-w-md text-orange-100">
              {stats.activeStreaks > 0 
                ? `You have ${stats.activeStreaks} active streak${stats.activeStreaks > 1 ? 's' : ''}. Keep the momentum going!`
                : "Start your first streak and build habits that stick!"
              }
            </p>
            {stats.longestActiveStreak > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 backdrop-blur-sm">
                <FlameIcon className="h-5 w-5 text-yellow-300" />
                <span className="font-medium">{stats.longestActiveStreak} day streak</span>
                {stats.longestStreakName && (
                  <span className="text-orange-100">on {stats.longestStreakName}</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="group relative overflow-hidden border-orange-100 bg-gradient-to-br from-orange-50 to-white transition-shadow hover:shadow-md dark:border-orange-900/50 dark:from-orange-950/50 dark:to-neutral-900">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-orange-500/10 transition-transform group-hover:scale-110" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Active Streaks</CardTitle>
              <FlameIcon className="h-5 w-5 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-600 dark:text-orange-400">{stats.activeStreaks}</div>
              <p className="mt-1 text-xs text-muted-foreground">habits in progress</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-emerald-100 bg-gradient-to-br from-emerald-50 to-white transition-shadow hover:shadow-md dark:border-emerald-900/50 dark:from-emerald-950/50 dark:to-neutral-900">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-emerald-500/10 transition-transform group-hover:scale-110" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Total Check-ins</CardTitle>
              <CalendarCheckIcon className="h-5 w-5 text-emerald-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">{stats.totalCheckIns}</div>
              <p className="mt-1 text-xs text-muted-foreground">days completed</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-violet-100 bg-gradient-to-br from-violet-50 to-white transition-shadow hover:shadow-md dark:border-violet-900/50 dark:from-violet-950/50 dark:to-neutral-900">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-violet-500/10 transition-transform group-hover:scale-110" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Completed</CardTitle>
              <TrophyIcon className="h-5 w-5 text-violet-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-violet-600 dark:text-violet-400">{stats.completedStreaks}</div>
              <p className="mt-1 text-xs text-muted-foreground">streaks finished</p>
            </CardContent>
          </Card>

          <Card className="group relative overflow-hidden border-amber-100 bg-gradient-to-br from-amber-50 to-white transition-shadow hover:shadow-md dark:border-amber-900/50 dark:from-amber-950/50 dark:to-neutral-900">
            <div className="absolute -right-4 -top-4 h-20 w-20 rounded-full bg-amber-500/10 transition-transform group-hover:scale-110" />
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Best Streak</CardTitle>
              <ZapIcon className="h-5 w-5 text-amber-500" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-amber-600 dark:text-amber-400">{stats.longestActiveStreak}</div>
              <p className="mt-1 text-xs text-muted-foreground">days record</p>
            </CardContent>
          </Card>
        </div>

        {/* Active Streaks & Activity */}
        <div className="grid gap-6 lg:grid-cols-3">
          {/* Active Streaks */}
          <div className="lg:col-span-2">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Your Streaks</h2>
              <Button variant="ghost" size="sm" asChild>
                <Link href="/dashboard/streaks">
                  View all <ArrowRightIcon className="ml-1 h-4 w-4" />
                </Link>
              </Button>
            </div>

            {activeStreaks.length === 0 ? (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="mb-4 rounded-full bg-orange-100 p-4 dark:bg-orange-900/50">
                    <SparklesIcon className="h-8 w-8 text-orange-500" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold">No active streaks yet</h3>
                  <p className="mb-4 max-w-sm text-sm text-muted-foreground">
                    Start building habits that stick. Create your first streak and begin your journey!
                  </p>
                  <Button asChild>
                    <Link href="/dashboard/streaks/new">
                      <PlusIcon className="mr-2 h-4 w-4" />
                      Create Your First Streak
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {activeStreaks.slice(0, 4).map((streak) => {
                  const progress = Math.min((streak.currentStreak / streak.targetDays) * 100, 100)
                  return (
                    <Link key={streak.id} href={`/dashboard/streaks/${streak.id}`}>
                      <Card className="group h-full transition-all hover:border-orange-200 hover:shadow-md dark:hover:border-orange-800">
                        <CardContent className="p-5">
                          <div className="flex items-start justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-2xl">{streak.emoji}</span>
                              <div>
                                <h3 className="font-semibold group-hover:text-orange-600 dark:group-hover:text-orange-400">
                                  {streak.name}
                                </h3>
                                <p className="text-sm text-muted-foreground">
                                  {streak.targetDays} day challenge
                                </p>
                              </div>
                            </div>
                            <Badge 
                              variant="outline" 
                              className="border-orange-200 bg-orange-50 text-orange-700 dark:border-orange-800 dark:bg-orange-950 dark:text-orange-300"
                            >
                              {streak.currentStreak} days
                            </Badge>
                          </div>
                          <div className="mt-4">
                            <div className="mb-1.5 flex justify-between text-xs">
                              <span className="text-muted-foreground">Progress</span>
                              <span className="font-medium">{Math.round(progress)}%</span>
                            </div>
                            <div className="h-2 overflow-hidden rounded-full bg-neutral-100 dark:bg-neutral-800">
                              <div
                                className="h-full rounded-full transition-all"
                                style={{ 
                                  width: `${progress}%`,
                                  backgroundColor: streak.color 
                                }}
                              />
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  )
                })}
              </div>
            )}
          </div>

          {/* Recent Activity */}
          <div>
            <div className="mb-4 flex items-center justify-between">
              <h2 className="text-lg font-semibold">Recent Activity</h2>
            </div>
            <Card>
              <CardContent className="p-0">
                {recentActivity.length === 0 ? (
                  <div className="py-8 text-center text-sm text-muted-foreground">
                    No activity yet. Check in to your streaks!
                  </div>
                ) : (
                  <div className="divide-y">
                    {recentActivity.slice(0, 6).map((activity) => (
                      <div key={activity.id} className="flex items-center gap-3 px-4 py-3">
                        <span className="text-lg">{activity.streak.emoji}</span>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium">{activity.streak.name}</p>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                        <Badge variant="secondary" className="shrink-0 text-xs">
                          ✓
                        </Badge>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
