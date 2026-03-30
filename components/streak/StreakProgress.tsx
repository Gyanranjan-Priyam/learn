"use client"

import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface StreakProgressProps {
  currentStreak: number
  targetDays: number
  color: string
  size?: "sm" | "md" | "lg"
}

export function StreakProgress({
  currentStreak,
  targetDays,
  color,
  size = "md",
}: StreakProgressProps) {
  const percentage = Math.min(100, (currentStreak / targetDays) * 100)
  const circumference = 2 * Math.PI * 45 // radius = 45
  const strokeDashoffset = circumference - (percentage / 100) * circumference

  const dimensions = {
    sm: { size: 80, fontSize: "text-lg", subSize: "text-xs" },
    md: { size: 120, fontSize: "text-2xl", subSize: "text-sm" },
    lg: { size: 160, fontSize: "text-4xl", subSize: "text-base" },
  }

  const { size: svgSize, fontSize, subSize } = dimensions[size]

  return (
    <div
      className="relative inline-flex items-center justify-center"
      style={{ width: svgSize, height: svgSize }}
    >
      <svg
        width={svgSize}
        height={svgSize}
        viewBox="0 0 100 100"
        className="-rotate-90"
      >
        {/* Background circle */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="currentColor"
          strokeWidth="8"
          className="text-muted/20"
        />
        {/* Progress circle */}
        <motion.circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="drop-shadow-lg"
          style={{
            filter: `drop-shadow(0 0 8px ${color}40)`,
          }}
        />
      </svg>
      
      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          className={cn("font-black", fontSize)}
          style={{ color }}
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          {currentStreak}
        </motion.span>
        <span className={cn("text-muted-foreground", subSize)}>
          / {targetDays} days
        </span>
      </div>
    </div>
  )
}
