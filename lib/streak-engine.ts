import { startOfDay, differenceInCalendarDays, isSameDay, subDays } from "date-fns"
import { toZonedTime, formatInTimeZone } from "date-fns-tz"
import { MILESTONES, type MilestoneDay } from "./constants"

/**
 * Get today's date in a specific timezone, normalized to midnight
 */
export function getTodayInTimezone(timezone: string): Date {
  const now = new Date()
  const zonedDate = toZonedTime(now, timezone)
  return startOfDay(zonedDate)
}

/**
 * Format a date in a specific timezone
 */
export function formatDateInTimezone(
  date: Date,
  timezone: string,
  format: string = "yyyy-MM-dd"
): string {
  return formatInTimeZone(date, timezone, format)
}

/**
 * Calculate current streak from an array of check-in dates
 * Counts consecutive days from today (or yesterday if not checked in today)
 */
export function calculateCurrentStreak(
  checkInDates: Date[],
  timezone: string = "UTC"
): number {
  if (checkInDates.length === 0) return 0

  // Normalize all dates to start of day in the given timezone
  const today = getTodayInTimezone(timezone)
  const sortedDates = checkInDates
    .map((d) => startOfDay(toZonedTime(d, timezone)))
    .sort((a, b) => b.getTime() - a.getTime()) // Most recent first

  let streak = 0
  let currentDate = today

  // Check if checked in today
  const checkedInToday = isSameDay(sortedDates[0], today)
  if (!checkedInToday) {
    // If not checked in today, start counting from yesterday
    currentDate = subDays(today, 1)
    // If yesterday also wasn't a check-in, streak is 0
    if (!isSameDay(sortedDates[0], currentDate)) {
      return 0
    }
  }

  // Count consecutive days
  for (const date of sortedDates) {
    if (isSameDay(date, currentDate)) {
      streak++
      currentDate = subDays(currentDate, 1)
    } else if (date < currentDate) {
      // Gap found, stop counting
      break
    }
  }

  return streak
}

/**
 * Calculate the longest streak ever achieved
 */
export function calculateLongestStreak(checkInDates: Date[]): number {
  if (checkInDates.length === 0) return 0
  if (checkInDates.length === 1) return 1

  // Sort dates chronologically
  const sortedDates = checkInDates
    .map((d) => startOfDay(d))
    .sort((a, b) => a.getTime() - b.getTime())

  let longestStreak = 1
  let currentStreak = 1

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = differenceInCalendarDays(sortedDates[i], sortedDates[i - 1])
    if (diff === 1) {
      currentStreak++
      longestStreak = Math.max(longestStreak, currentStreak)
    } else if (diff > 1) {
      currentStreak = 1
    }
    // diff === 0 means same day (duplicate), skip
  }

  return longestStreak
}

/**
 * Check if user has already checked in today
 */
export function hasCheckedInToday(
  checkInDates: Date[],
  timezone: string = "UTC"
): boolean {
  if (checkInDates.length === 0) return false

  const today = getTodayInTimezone(timezone)
  return checkInDates.some((date) => {
    const zonedDate = startOfDay(toZonedTime(date, timezone))
    return isSameDay(zonedDate, today)
  })
}

/**
 * Check if a day count is a milestone
 */
export function isMilestone(days: number): days is MilestoneDay {
  return (MILESTONES as readonly number[]).includes(days)
}

/**
 * Get the next milestone to reach
 */
export function getNextMilestone(currentStreak: number): MilestoneDay | null {
  for (const milestone of MILESTONES) {
    if (milestone > currentStreak) {
      return milestone
    }
  }
  return null
}

/**
 * Get the previous milestone reached
 */
export function getPreviousMilestone(currentStreak: number): MilestoneDay | null {
  const reversed = [...MILESTONES].reverse()
  for (const milestone of reversed) {
    if (milestone <= currentStreak) {
      return milestone
    }
  }
  return null
}

/**
 * Calculate progress to next milestone as a percentage
 */
export function getMilestoneProgress(currentStreak: number): {
  progress: number
  nextMilestone: MilestoneDay | null
  daysRemaining: number
} {
  const nextMilestone = getNextMilestone(currentStreak)
  const previousMilestone = getPreviousMilestone(currentStreak) ?? 0

  if (!nextMilestone) {
    return { progress: 100, nextMilestone: null, daysRemaining: 0 }
  }

  const rangeTotal = nextMilestone - previousMilestone
  const rangeCurrent = currentStreak - previousMilestone
  const progress = Math.round((rangeCurrent / rangeTotal) * 100)

  return {
    progress,
    nextMilestone,
    daysRemaining: nextMilestone - currentStreak,
  }
}

/**
 * Get all achieved milestones for a streak
 */
export function getAchievedMilestones(currentStreak: number): MilestoneDay[] {
  return MILESTONES.filter((m) => currentStreak >= m) as MilestoneDay[]
}

/**
 * Calculate streak health (for visual indicators)
 * Returns a value 0-100 based on check-in consistency
 */
export function calculateStreakHealth(
  checkInDates: Date[],
  startDate: Date,
  timezone: string = "UTC"
): number {
  const today = getTodayInTimezone(timezone)
  const start = startOfDay(toZonedTime(startDate, timezone))
  const totalDays = differenceInCalendarDays(today, start) + 1

  if (totalDays <= 0) return 100

  const uniqueDays = new Set(
    checkInDates.map((d) => formatDateInTimezone(d, timezone))
  ).size

  return Math.round((uniqueDays / totalDays) * 100)
}

/**
 * Get streak status text
 */
export function getStreakStatusText(
  currentStreak: number,
  hasCheckedIn: boolean
): string {
  if (currentStreak === 0) {
    return hasCheckedIn ? "Started today!" : "Ready to begin"
  }
  if (hasCheckedIn) {
    return `${currentStreak} day${currentStreak === 1 ? "" : "s"} 🔥`
  }
  return `${currentStreak} day${currentStreak === 1 ? "" : "s"} - check in today!`
}

/**
 * Calculate days until streak completion
 */
export function getDaysUntilCompletion(
  currentStreak: number,
  targetDays: number
): number {
  return Math.max(0, targetDays - currentStreak)
}

/**
 * Get completion percentage
 */
export function getCompletionPercentage(
  currentStreak: number,
  targetDays: number
): number {
  if (targetDays <= 0) return 100
  return Math.min(100, Math.round((currentStreak / targetDays) * 100))
}
