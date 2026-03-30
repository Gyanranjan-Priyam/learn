"use client"

import { motion } from "framer-motion"
import { Trophy, Star, Flame, Crown, Zap, Target, Sparkles } from "lucide-react"
import { MILESTONE_MESSAGES, type MilestoneDay } from "@/lib/constants"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface MilestoneBadgeProps {
  days: MilestoneDay
  achieved: boolean
  reachedAt?: Date
  size?: "sm" | "md" | "lg"
}

const MILESTONE_ICONS: Record<MilestoneDay, typeof Trophy> = {
  5: Star,
  10: Target,
  15: Zap,
  20: Flame,
  25: Sparkles,
  30: Trophy,
  60: Crown,
  90: Crown,
  100: Crown,
}

const MILESTONE_COLORS: Record<MilestoneDay, { bg: string; text: string; ring: string }> = {
  5: { bg: "bg-emerald-500/10", text: "text-emerald-500", ring: "ring-emerald-500/30" },
  10: { bg: "bg-blue-500/10", text: "text-blue-500", ring: "ring-blue-500/30" },
  15: { bg: "bg-amber-500/10", text: "text-amber-500", ring: "ring-amber-500/30" },
  20: { bg: "bg-orange-500/10", text: "text-orange-500", ring: "ring-orange-500/30" },
  25: { bg: "bg-purple-500/10", text: "text-purple-500", ring: "ring-purple-500/30" },
  30: { bg: "bg-gradient-to-br from-amber-500/20 to-orange-500/20", text: "text-amber-500", ring: "ring-amber-500/40" },
  60: { bg: "bg-gradient-to-br from-sky-500/20 to-blue-500/20", text: "text-sky-500", ring: "ring-sky-500/40" },
  90: { bg: "bg-gradient-to-br from-violet-500/20 to-purple-500/20", text: "text-violet-500", ring: "ring-violet-500/40" },
  100: { bg: "bg-gradient-to-br from-amber-400/30 via-orange-500/30 to-red-500/30", text: "text-amber-400", ring: "ring-amber-400/50" },
}

export function MilestoneBadge({
  days,
  achieved,
  reachedAt,
  size = "md",
}: MilestoneBadgeProps) {
  const Icon = MILESTONE_ICONS[days]
  const colors = MILESTONE_COLORS[days]
  const message = MILESTONE_MESSAGES[days]

  const sizes = {
    sm: { badge: "w-10 h-10", icon: "w-4 h-4", text: "text-[10px]" },
    md: { badge: "w-14 h-14", icon: "w-6 h-6", text: "text-xs" },
    lg: { badge: "w-20 h-20", icon: "w-8 h-8", text: "text-sm" },
  }

  const { badge: badgeSize, icon: iconSize, text: textSize } = sizes[size]

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div
          className={cn(
            "relative flex flex-col items-center justify-center rounded-xl ring-2 transition-all",
            badgeSize,
            achieved
              ? cn(colors.bg, colors.ring)
              : "bg-muted/30 ring-muted/20 opacity-40"
          )}
          initial={false}
          animate={achieved ? { scale: [1, 1.1, 1] } : {}}
          whileHover={achieved ? { scale: 1.05 } : {}}
        >
          <Icon
            className={cn(
              iconSize,
              achieved ? colors.text : "text-muted-foreground/50"
            )}
          />
          <span
            className={cn(
              "font-bold mt-0.5",
              textSize,
              achieved ? colors.text : "text-muted-foreground/50"
            )}
          >
            {days}
          </span>
          
          {/* Shine effect for achieved badges */}
          {achieved && (
            <motion.div
              className="absolute inset-0 rounded-xl bg-gradient-to-tr from-white/20 to-transparent"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: [0, 1, 0], x: 20 }}
              transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            />
          )}
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="top" className="max-w-[200px]">
        <div className="text-center">
          <p className="font-semibold flex items-center gap-1">
            <span>{message.emoji}</span>
            <span>{message.headline}</span>
          </p>
          <p className="text-xs text-muted-foreground mt-1">
            {achieved
              ? message.subtext
              : `${days} days to unlock`}
          </p>
          {achieved && reachedAt && (
            <p className="text-xs text-muted-foreground mt-1">
              Achieved {reachedAt.toLocaleDateString()}
            </p>
          )}
        </div>
      </TooltipContent>
    </Tooltip>
  )
}

interface MilestoneRowProps {
  currentStreak: number
  milestones: Array<{ days: number; reachedAt: Date }>
  size?: "sm" | "md" | "lg"
}

export function MilestoneRow({
  currentStreak,
  milestones,
  size = "sm",
}: MilestoneRowProps) {
  const achievedDays = new Set(milestones.map((m) => m.days))

  return (
    <div className="flex flex-wrap gap-2">
      {([5, 10, 15, 20, 25, 30, 60, 90, 100] as MilestoneDay[]).map((days) => {
        const milestone = milestones.find((m) => m.days === days)
        return (
          <MilestoneBadge
            key={days}
            days={days}
            achieved={achievedDays.has(days) || currentStreak >= days}
            reachedAt={milestone?.reachedAt}
            size={size}
          />
        )
      })}
    </div>
  )
}
