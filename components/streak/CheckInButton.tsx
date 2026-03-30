"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { CheckCircle2, Loader2, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import { checkInToday } from "@/actions/checkin"
import { cn } from "@/lib/utils"

interface CheckInButtonProps {
  streakId: string
  streakName: string
  hasCheckedInToday: boolean
  currentStreak: number
  color: string
  onSuccess?: (milestoneReached: number | null) => void
}

export function CheckInButton({
  streakId,
  streakName,
  hasCheckedInToday,
  currentStreak,
  color,
  onSuccess,
}: CheckInButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [justCheckedIn, setJustCheckedIn] = useState(false)
  const router = useRouter()

  const handleCheckIn = async () => {
    if (hasCheckedInToday || isLoading) return

    setIsLoading(true)
    try {
      const result = await checkInToday({ streakId })
      
      if (result.success) {
        setJustCheckedIn(true)
        onSuccess?.(result.data.milestoneReached)
        router.refresh()
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error("Check-in failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const isCheckedIn = hasCheckedInToday || justCheckedIn

  return (
    <motion.div
      initial={false}
      animate={justCheckedIn ? { scale: [1, 1.1, 1] } : {}}
      transition={{ duration: 0.3 }}
    >
      <Button
        onClick={handleCheckIn}
        disabled={isCheckedIn || isLoading}
        className={cn(
          "relative h-14 px-8 text-lg font-bold rounded-2xl transition-all duration-300",
          "shadow-lg hover:shadow-xl",
          isCheckedIn
            ? "bg-emerald-500 hover:bg-emerald-500 text-white cursor-default"
            : "text-white hover:scale-105"
        )}
        style={{
          backgroundColor: isCheckedIn ? undefined : color,
        }}
      >
        {isLoading ? (
          <>
            <Loader2 className="mr-2 h-5 w-5 animate-spin" />
            Checking in...
          </>
        ) : isCheckedIn ? (
          <>
            <CheckCircle2 className="mr-2 h-5 w-5" />
            Done for today!
          </>
        ) : (
          <>
            <Sparkles className="mr-2 h-5 w-5" />
            Mark Today Done
          </>
        )}
        
        {/* Pulse effect when not checked in */}
        {!isCheckedIn && !isLoading && (
          <motion.span
            className="absolute inset-0 rounded-2xl"
            style={{ backgroundColor: color }}
            animate={{ opacity: [0.5, 0, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        )}
      </Button>
    </motion.div>
  )
}
