"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { format } from "date-fns"
import { Flame, Target, TrendingUp, Calendar, Snowflake, Trophy } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckInButton } from "@/components/streak/CheckInButton"
import { FreezeButton } from "@/components/streak/FreezeButton"
import { StreakProgress } from "@/components/streak/StreakProgress"
import { StreakHeatmap } from "@/components/streak/StreakHeatmap"
import { MilestoneRow } from "@/components/streak/MilestoneBadge"
import { ConfettiBlast } from "@/components/shared/ConfettiBlast"
import { type MilestoneDay, MILESTONE_MESSAGES } from "@/lib/constants"

interface StreakDetailClientProps {
  streak: {
    id: string
    name: string
    description: string | null
    emoji: string
    color: string
    targetDays: number
    currentStreak: number
    longestStreak: number
    totalDays: number
    status: "ACTIVE" | "PAUSED" | "COMPLETED" | "ABANDONED"
    startDate: Date
    freezesUsed: number
    freezesAllowed: number
    checkIns: Array<{
      date: Date
      isFrozen: boolean
      note: string | null
    }>
    milestones: Array<{
      days: number
      reachedAt: Date
    }>
  }
  userTimezone: string
  checkedInToday: boolean
  milestoneProgress: {
    progress: number
    nextMilestone: MilestoneDay | null
    daysRemaining: number
  }
  completionPercentage: number
  freezesRemaining: number
}

export function StreakDetailClient({
  streak,
  userTimezone,
  checkedInToday,
  milestoneProgress,
  completionPercentage,
  freezesRemaining,
}: StreakDetailClientProps) {
  const [showConfetti, setShowConfetti] = useState(false)
  const [milestoneReached, setMilestoneReached] = useState<MilestoneDay | null>(null)

  const handleCheckInSuccess = (milestone: number | null) => {
    if (milestone) {
      setMilestoneReached(milestone as MilestoneDay)
      setShowConfetti(true)
    }
  }

  const handleConfettiComplete = () => {
    setShowConfetti(false)
    setMilestoneReached(null)
  }

  const isComplete = streak.status === "COMPLETED"
  const isActive = streak.status === "ACTIVE"

  return (
    <>
      <ConfettiBlast trigger={showConfetti} onComplete={handleConfettiComplete} />

      {/* Milestone celebration modal */}
      <AnimatePresence>
        {milestoneReached && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
            onClick={handleConfettiComplete}
          >
            <motion.div
              initial={{ scale: 0.5, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.5, y: 50 }}
              className="bg-card p-8 rounded-3xl shadow-2xl text-center max-w-sm mx-4"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="text-6xl mb-4">
                {MILESTONE_MESSAGES[milestoneReached].emoji}
              </div>
              <h2 className="text-3xl font-black mb-2">
                {milestoneReached} Days!
              </h2>
              <p className="text-xl font-bold text-primary">
                {MILESTONE_MESSAGES[milestoneReached].headline}
              </p>
              <p className="text-muted-foreground mt-2">
                {MILESTONE_MESSAGES[milestoneReached].subtext}
              </p>
              <button
                onClick={handleConfettiComplete}
                className="mt-6 px-6 py-2 bg-primary text-primary-foreground rounded-full font-semibold"
              >
                Keep Going! 🚀
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <Card
          className="overflow-hidden border-2"
          style={{ borderColor: `${streak.color}30` }}
        >
          {/* Color bar */}
          <div className="h-2" style={{ backgroundColor: streak.color }} />

          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
              {/* Emoji & Info */}
              <div className="flex items-center gap-4 flex-1">
                <div
                  className="w-20 h-20 rounded-2xl flex items-center justify-center text-5xl shrink-0"
                  style={{ backgroundColor: `${streak.color}15` }}
                >
                  {streak.emoji}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h1 className="text-2xl sm:text-3xl font-black">
                      {streak.name}
                    </h1>
                    {isComplete && (
                      <Badge className="bg-amber-500/20 text-amber-500 border-amber-500/30">
                        <Trophy className="w-3 h-3 mr-1" />
                        Completed
                      </Badge>
                    )}
                  </div>
                  {streak.description && (
                    <p className="text-muted-foreground mt-1">
                      {streak.description}
                    </p>
                  )}
                  <p className="text-sm text-muted-foreground mt-2">
                    Started {format(new Date(streak.startDate), "MMMM d, yyyy")}
                  </p>
                </div>
              </div>

              {/* Progress Ring */}
              <div className="shrink-0">
                <StreakProgress
                  currentStreak={streak.currentStreak}
                  targetDays={streak.targetDays}
                  color={streak.color}
                  size="lg"
                />
              </div>
            </div>

            {/* Action Buttons */}
            {isActive && (
              <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t">
                <CheckInButton
                  streakId={streak.id}
                  streakName={streak.name}
                  hasCheckedInToday={checkedInToday}
                  currentStreak={streak.currentStreak}
                  color={streak.color}
                  onSuccess={handleCheckInSuccess}
                />
                <FreezeButton
                  streakId={streak.id}
                  freezesUsed={streak.freezesUsed}
                  freezesAllowed={streak.freezesAllowed}
                  hasCheckedInToday={checkedInToday}
                />
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Stats Grid */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8"
      >
        <Card>
          <CardContent className="p-4 text-center">
            <Flame
              className="w-6 h-6 mx-auto mb-2"
              style={{ color: streak.color }}
            />
            <p className="text-2xl font-black">{streak.currentStreak}</p>
            <p className="text-xs text-muted-foreground">Current Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <TrendingUp className="w-6 h-6 mx-auto mb-2 text-emerald-500" />
            <p className="text-2xl font-black">{streak.longestStreak}</p>
            <p className="text-xs text-muted-foreground">Best Streak</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Calendar className="w-6 h-6 mx-auto mb-2 text-blue-500" />
            <p className="text-2xl font-black">{streak.totalDays}</p>
            <p className="text-xs text-muted-foreground">Total Days</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 text-center">
            <Snowflake className="w-6 h-6 mx-auto mb-2 text-sky-500" />
            <p className="text-2xl font-black">{freezesRemaining}</p>
            <p className="text-xs text-muted-foreground">Freezes Left</p>
          </CardContent>
        </Card>
      </motion.div>

      {/* Milestones */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-amber-500" />
              Milestones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <MilestoneRow
              currentStreak={streak.currentStreak}
              milestones={streak.milestones}
              size="md"
            />
            {milestoneProgress.nextMilestone && (
              <p className="text-sm text-muted-foreground mt-4">
                <span className="font-semibold" style={{ color: streak.color }}>
                  {milestoneProgress.daysRemaining} days
                </span>{" "}
                until your next milestone ({milestoneProgress.nextMilestone} days)
              </p>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* Activity Heatmap */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-500" />
              Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <StreakHeatmap
              checkIns={streak.checkIns}
              color={streak.color}
              startDate={new Date(streak.startDate)}
            />
          </CardContent>
        </Card>
      </motion.div>
    </>
  )
}
