"use client"

import { useMemo } from "react"
import { ActivityCalendar, type Activity, type ThemeInput } from "react-activity-calendar"
import { format, startOfYear, eachDayOfInterval, endOfYear } from "date-fns"
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip"

interface CheckIn {
  date: Date
  isFrozen: boolean
  note?: string | null
}

interface StreakHeatmapProps {
  checkIns: CheckIn[]
  color: string
  startDate?: Date
  showLabels?: boolean
  blockSize?: number
}

export function StreakHeatmap({
  checkIns,
  color,
  startDate,
  showLabels = true,
  blockSize = 12,
}: StreakHeatmapProps) {
  // Transform check-ins into activity data
  const activities: Activity[] = useMemo(() => {
    const year = startDate?.getFullYear() ?? new Date().getFullYear()
    const yearStart = startOfYear(new Date(year, 0, 1))
    const yearEnd = endOfYear(new Date(year, 0, 1))
    const allDays = eachDayOfInterval({ start: yearStart, end: yearEnd })

    // Create a map of check-in dates
    const checkInMap = new Map<string, CheckIn>()
    checkIns.forEach((checkIn) => {
      const dateKey = format(new Date(checkIn.date), "yyyy-MM-dd")
      checkInMap.set(dateKey, checkIn)
    })

    // Create activity for each day
    return allDays.map((day) => {
      const dateKey = format(day, "yyyy-MM-dd")
      const checkIn = checkInMap.get(dateKey)
      
      let level = 0
      if (checkIn) {
        level = checkIn.isFrozen ? 2 : 4 // Frozen = medium, Normal = high
      }

      return {
        date: dateKey,
        count: checkIn ? 1 : 0,
        level,
      }
    })
  }, [checkIns, startDate])

  // Custom theme based on streak color
  const theme: ThemeInput = useMemo(
    () => ({
      dark: [
        "rgba(255,255,255,0.05)", // Level 0 - Empty
        `${color}20`, // Level 1 - Very light
        `${color}40`, // Level 2 - Frozen (light)
        `${color}80`, // Level 3 - Medium
        color, // Level 4 - Full
      ],
      light: [
        "rgba(0,0,0,0.05)", // Level 0 - Empty
        `${color}20`, // Level 1 - Very light
        `${color}40`, // Level 2 - Frozen (light)
        `${color}80`, // Level 3 - Medium
        color, // Level 4 - Full
      ],
    }),
    [color]
  )

  // Tooltip content renderer
  const renderTooltip = (activity: Activity) => {
    const checkIn = checkIns.find(
      (c) => format(new Date(c.date), "yyyy-MM-dd") === activity.date
    )
    const isCheckIn = activity.count > 0
    const isFrozen = checkIn?.isFrozen ?? false

    return (
      <div className="text-center p-1">
        <p className="font-medium">
          {format(new Date(activity.date), "MMM d, yyyy")}
        </p>
        {isCheckIn ? (
          <>
            <p className="text-xs text-emerald-400">
              {isFrozen ? "🧊 Frozen" : "✅ Checked in"}
            </p>
            {checkIn?.note && (
              <p className="text-xs text-muted-foreground mt-1 max-w-[150px]">
                {checkIn.note}
              </p>
            )}
          </>
        ) : (
          <p className="text-xs text-muted-foreground">No check-in</p>
        )}
      </div>
    )
  }

  return (
    <div className="overflow-x-auto pb-2">
      <ActivityCalendar
        data={activities}
        theme={theme}
        blockSize={blockSize}
        blockRadius={3}
        blockMargin={3}
        fontSize={12}
        showWeekdayLabels={showLabels}
        renderBlock={(block, activity) => (
          <Tooltip key={activity.date}>
            <TooltipTrigger asChild>
              {block}
            </TooltipTrigger>
            <TooltipContent side="top">
              {renderTooltip(activity)}
            </TooltipContent>
          </Tooltip>
        )}
        labels={{
          months: [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
          ],
          weekdays: ["", "Mon", "", "Wed", "", "Fri", ""],
          totalCount: "{{count}} check-ins",
        }}
      />
    </div>
  )
}
