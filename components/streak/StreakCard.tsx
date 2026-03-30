"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { MoreHorizontal, Flame, Calendar, Target, TrendingUp } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { StreakProgress } from "./StreakProgress"
import { getCompletionPercentage, hasCheckedInToday } from "@/lib/streak-engine"

interface Streak {
  id: string
  name: string
  description?: string | null
  emoji: string
  color: string
  targetDays: number
  currentStreak: number
  longestStreak: number
  totalDays: number
  status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ABANDONED"
  startDate: Date
  checkIns: Array<{ date: Date }>
}

interface StreakCardProps {
  streak: Streak
  variant?: "default" | "compact"
  userTimezone?: string
}

export function StreakCard({
  streak,
  variant = "default",
  userTimezone = "UTC",
}: StreakCardProps) {
  const checkedIn = hasCheckedInToday(
    streak.checkIns.map((c) => new Date(c.date)),
    userTimezone
  )
  const completion = getCompletionPercentage(streak.currentStreak, streak.targetDays)
  const isComplete = streak.status === "COMPLETED"
  const isAbandoned = streak.status === "ABANDONED"
  const isPaused = streak.status === "PAUSED"

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/dashboard/streaks/${streak.id}`}>
        <Card
          className={cn(
            "relative overflow-hidden transition-all duration-300 cursor-pointer",
            "hover:shadow-lg border-2",
            checkedIn && "ring-2 ring-emerald-500/30",
            isComplete && "border-amber-500/30 bg-amber-500/5",
            isAbandoned && "opacity-60 border-muted",
            isPaused && "border-sky-500/30 bg-sky-500/5"
          )}
          style={{
            borderColor: !isComplete && !isAbandoned && !isPaused ? `${streak.color}30` : undefined,
          }}
        >
          {/* Status indicator bar */}
          <div
            className="absolute top-0 left-0 right-0 h-1"
            style={{ backgroundColor: streak.color }}
          />

          <CardContent className={cn("p-4", variant === "compact" && "p-3")}>
            <div className="flex items-start justify-between">
              {/* Left section - Info */}
              <div className="flex items-start gap-3 flex-1 min-w-0">
                {/* Emoji badge */}
                <div
                  className="flex items-center justify-center w-12 h-12 rounded-xl text-2xl shrink-0"
                  style={{ backgroundColor: `${streak.color}15` }}
                >
                  {streak.emoji}
                </div>

                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-base truncate">
                      {streak.name}
                    </h3>
                    {checkedIn && (
                      <span className="text-xs bg-emerald-500/20 text-emerald-500 px-2 py-0.5 rounded-full font-medium shrink-0">
                        ✓ Done
                      </span>
                    )}
                    {isPaused && (
                      <span className="text-xs bg-sky-500/20 text-sky-500 px-2 py-0.5 rounded-full font-medium shrink-0">
                        Paused
                      </span>
                    )}
                    {isComplete && (
                      <span className="text-xs bg-amber-500/20 text-amber-500 px-2 py-0.5 rounded-full font-medium shrink-0">
                        🏆 Complete
                      </span>
                    )}
                  </div>

                  {streak.description && variant === "default" && (
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">
                      {streak.description}
                    </p>
                  )}

                  {/* Stats row */}
                  <div className="flex items-center gap-4 mt-2 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Flame className="w-3 h-3" style={{ color: streak.color }} />
                      {streak.currentStreak} day{streak.currentStreak !== 1 && "s"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Target className="w-3 h-3" />
                      {streak.targetDays} day target
                    </span>
                    <span className="flex items-center gap-1">
                      <TrendingUp className="w-3 h-3" />
                      Best: {streak.longestStreak}
                    </span>
                  </div>
                </div>
              </div>

              {/* Right section - Progress */}
              <div className="flex items-center gap-3 ml-4">
                <StreakProgress
                  currentStreak={streak.currentStreak}
                  targetDays={streak.targetDays}
                  color={streak.color}
                  size="sm"
                />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild onClick={(e) => e.preventDefault()}>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/streaks/${streak.id}`}>
                        View Details
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/streaks/${streak.id}/settings`}>
                        Edit Streak
                      </Link>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </CardContent>

          {/* Progress bar at bottom */}
          <div className="h-1 bg-muted">
            <motion.div
              className="h-full"
              style={{ backgroundColor: streak.color }}
              initial={{ width: 0 }}
              animate={{ width: `${completion}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}
