"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { requireAuth, getSession } from "@/lib/queries"
import { checkInSchema, useFreezeSchema, type CheckInInput } from "@/lib/validations"
import {
  getTodayInTimezone,
  formatDateInTimezone,
  calculateCurrentStreak,
  calculateLongestStreak,
  isMilestone,
} from "@/lib/streak-engine"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function checkInToday(
  input: Omit<CheckInInput, "date">
): Promise<ActionResult<{ milestoneReached: number | null }>> {
  try {
    const session = await requireAuth()
    const userId = session.user.id
    const userTimezone = (session.user as { timezone?: string }).timezone ?? "UTC"

    // Validate input
    const validatedData = checkInSchema.safeParse({
      ...input,
      date: new Date(),
    })
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message ?? "Invalid input",
      }
    }

    const { streakId, note } = validatedData.data

    // Verify ownership and get streak
    const streak = await db.streak.findUnique({
      where: { id: streakId },
      include: {
        checkIns: {
          orderBy: { date: "desc" },
        },
      },
    })

    if (!streak) {
      return { success: false, error: "Streak not found" }
    }

    if (streak.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    if (streak.status !== "ACTIVE") {
      return { success: false, error: "Cannot check in to an inactive streak" }
    }

    // Get today's date in user's timezone
    const today = getTodayInTimezone(userTimezone)
    const todayFormatted = formatDateInTimezone(today, userTimezone)

    // Check if already checked in today
    const existingCheckIn = await db.checkIn.findFirst({
      where: {
        streakId,
        date: today,
      },
    })

    if (existingCheckIn) {
      return { success: false, error: "Already checked in today" }
    }

    // Create the check-in
    await db.checkIn.create({
      data: {
        streakId,
        userId,
        date: today,
        note: note || null,
        isFrozen: false,
      },
    })

    // Recalculate streaks
    const allCheckInDates = [...streak.checkIns.map((c) => c.date), today]
    const newCurrentStreak = calculateCurrentStreak(allCheckInDates, userTimezone)
    const newLongestStreak = Math.max(
      streak.longestStreak,
      calculateLongestStreak(allCheckInDates)
    )
    const newTotalDays = streak.totalDays + 1

    // Check for completion
    const isComplete = newCurrentStreak >= streak.targetDays

    // Update streak stats
    await db.streak.update({
      where: { id: streakId },
      data: {
        currentStreak: newCurrentStreak,
        longestStreak: newLongestStreak,
        totalDays: newTotalDays,
        ...(isComplete && {
          status: "COMPLETED",
          completedAt: new Date(),
        }),
      },
    })

    // Check if milestone reached (for confetti)
    const milestoneReached = isMilestone(newCurrentStreak) ? newCurrentStreak : null

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/streaks")
    revalidatePath(`/dashboard/streaks/${streakId}`)

    return { success: true, data: { milestoneReached } }
  } catch (error) {
    console.error("Error checking in:", error)
    return { success: false, error: "Failed to check in" }
  }
}

export async function useFreeze(
  input: { streakId: string }
): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const userId = session.user.id
    const userTimezone = (session.user as { timezone?: string }).timezone ?? "UTC"

    const { streakId } = input

    // Verify ownership and get streak
    const streak = await db.streak.findUnique({
      where: { id: streakId },
      include: {
        checkIns: {
          orderBy: { date: "desc" },
          take: 1,
        },
      },
    })

    if (!streak) {
      return { success: false, error: "Streak not found" }
    }

    if (streak.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    if (streak.status !== "ACTIVE") {
      return { success: false, error: "Cannot freeze an inactive streak" }
    }

    if (streak.freezesUsed >= streak.freezesAllowed) {
      return { success: false, error: "No freezes remaining" }
    }

    // Get yesterday in user's timezone
    const today = getTodayInTimezone(userTimezone)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)

    // Check if yesterday was already checked in
    const yesterdayCheckIn = await db.checkIn.findFirst({
      where: {
        streakId,
        date: yesterday,
      },
    })

    if (yesterdayCheckIn) {
      return { success: false, error: "Yesterday was already checked in or frozen" }
    }

    // Create frozen check-in for yesterday
    await db.checkIn.create({
      data: {
        streakId,
        userId,
        date: yesterday,
        note: "🧊 Streak freeze used",
        isFrozen: true,
      },
    })

    // Update freeze count
    await db.streak.update({
      where: { id: streakId },
      data: {
        freezesUsed: streak.freezesUsed + 1,
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/streaks")
    revalidatePath(`/dashboard/streaks/${streakId}`)

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error using freeze:", error)
    return { success: false, error: "Failed to use freeze" }
  }
}
