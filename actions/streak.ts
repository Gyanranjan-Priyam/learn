"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/queries"
import {
  createStreakSchema,
  updateStreakSchema,
  type CreateStreakInput,
  type UpdateStreakInput,
} from "@/lib/validations"
import { STREAK_DEFAULTS } from "@/lib/constants"

type ActionResult<T = void> = 
  | { success: true; data: T }
  | { success: false; error: string }

export async function createStreak(
  input: CreateStreakInput
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await requireAuth()
    const userId = session.user.id

    // Validate input
    const validatedData = createStreakSchema.safeParse(input)
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message ?? "Invalid input",
      }
    }

    const { name, description, targetDays, color, emoji, freezesAllowed } =
      validatedData.data

    // Create the streak
    const streak = await db.streak.create({
      data: {
        userId,
        name,
        description: description || null,
        targetDays,
        color: color || STREAK_DEFAULTS.color,
        emoji: emoji || STREAK_DEFAULTS.emoji,
        freezesAllowed: freezesAllowed ?? STREAK_DEFAULTS.freezesAllowed,
        startDate: new Date(),
      },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/streaks")

    return { success: true, data: { id: streak.id } }
  } catch (error) {
    console.error("Error creating streak:", error)
    return { success: false, error: "Failed to create streak" }
  }
}

export async function updateStreak(
  streakId: string,
  input: UpdateStreakInput
): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const userId = session.user.id

    // Validate input
    const validatedData = updateStreakSchema.safeParse(input)
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message ?? "Invalid input",
      }
    }

    // Verify ownership
    const existingStreak = await db.streak.findUnique({
      where: { id: streakId },
      select: { userId: true },
    })

    if (!existingStreak) {
      return { success: false, error: "Streak not found" }
    }

    if (existingStreak.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    // Update the streak
    await db.streak.update({
      where: { id: streakId },
      data: validatedData.data,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/streaks")
    revalidatePath(`/dashboard/streaks/${streakId}`)

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error updating streak:", error)
    return { success: false, error: "Failed to update streak" }
  }
}

export async function deleteStreak(streakId: string): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const userId = session.user.id

    // Verify ownership
    const existingStreak = await db.streak.findUnique({
      where: { id: streakId },
      select: { userId: true, googleCalEventId: true },
    })

    if (!existingStreak) {
      return { success: false, error: "Streak not found" }
    }

    if (existingStreak.userId !== userId) {
      return { success: false, error: "Unauthorized" }
    }

    // TODO: If Google Calendar event exists, delete it
    // if (existingStreak.googleCalEventId) {
    //   await deleteGoogleCalendarEvent(existingStreak.googleCalEventId)
    // }

    // Delete the streak (cascade deletes check-ins and milestones)
    await db.streak.delete({
      where: { id: streakId },
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/streaks")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error deleting streak:", error)
    return { success: false, error: "Failed to delete streak" }
  }
}

export async function getStreakById(streakId: string) {
  const session = await requireAuth()
  const userId = session.user.id

  const streak = await db.streak.findUnique({
    where: { id: streakId },
    include: {
      checkIns: {
        orderBy: { date: "desc" },
      },
      milestones: {
        orderBy: { days: "desc" },
      },
    },
  })

  if (!streak || streak.userId !== userId) {
    return null
  }

  return streak
}
