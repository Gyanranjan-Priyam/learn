"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Snowflake, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useFreeze } from "@/actions/checkin"
import { cn } from "@/lib/utils"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface FreezeButtonProps {
  streakId: string
  freezesUsed: number
  freezesAllowed: number
  hasCheckedInToday: boolean
  disabled?: boolean
}

export function FreezeButton({
  streakId,
  freezesUsed,
  freezesAllowed,
  hasCheckedInToday,
  disabled,
}: FreezeButtonProps) {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const freezesRemaining = freezesAllowed - freezesUsed
  const canFreeze = freezesRemaining > 0 && !hasCheckedInToday && !disabled

  const handleFreeze = async () => {
    if (!canFreeze || isLoading) return

    setIsLoading(true)
    try {
      const result = await useFreeze({ streakId })
      
      if (result.success) {
        router.refresh()
      } else {
        console.error(result.error)
      }
    } catch (error) {
      console.error("Freeze failed:", error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <motion.div whileHover={canFreeze ? { scale: 1.02 } : {}} whileTap={canFreeze ? { scale: 0.98 } : {}}>
          <Button
            onClick={handleFreeze}
            disabled={!canFreeze || isLoading}
            variant="outline"
            className={cn(
              "relative h-10 px-4 font-medium rounded-xl transition-all",
              "border-sky-500/30 bg-sky-500/5 hover:bg-sky-500/10 text-sky-500",
              !canFreeze && "opacity-50 cursor-not-allowed"
            )}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Freezing...
              </>
            ) : (
              <>
                <Snowflake className="mr-2 h-4 w-4" />
                Use Freeze
                <span className="ml-2 text-xs opacity-70">
                  ({freezesRemaining}/{freezesAllowed})
                </span>
              </>
            )}
          </Button>
        </motion.div>
      </TooltipTrigger>
      <TooltipContent side="bottom">
        <div className="text-center max-w-[200px]">
          <p className="font-medium">🧊 Streak Freeze</p>
          <p className="text-xs text-muted-foreground mt-1">
            {canFreeze
              ? "Preserve your streak by freezing yesterday. Use wisely!"
              : hasCheckedInToday
              ? "You've already checked in today"
              : freezesRemaining === 0
              ? "No freezes remaining"
              : "Cannot freeze right now"}
          </p>
        </div>
      </TooltipContent>
    </Tooltip>
  )
}
