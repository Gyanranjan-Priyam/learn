"use server"

import { revalidatePath } from "next/cache"
import { db } from "@/lib/db"
import { requireAuth } from "@/lib/queries"
import { updateUserSettingsSchema, type UpdateUserSettingsInput } from "@/lib/validations"

type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string }

export async function updateUserSettings(
  input: UpdateUserSettingsInput
): Promise<ActionResult> {
  try {
    const session = await requireAuth()
    const userId = session.user.id

    // Validate input
    const validatedData = updateUserSettingsSchema.safeParse(input)
    if (!validatedData.success) {
      return {
        success: false,
        error: validatedData.error.issues[0]?.message ?? "Invalid input",
      }
    }

    // Update user settings
    await db.user.update({
      where: { id: userId },
      data: validatedData.data,
    })

    revalidatePath("/dashboard")
    revalidatePath("/dashboard/settings")

    return { success: true, data: undefined }
  } catch (error) {
    console.error("Error updating settings:", error)
    return { success: false, error: "Failed to update settings" }
  }
}

export async function getUserSettings() {
  const session = await requireAuth()
  const userId = session.user.id

  const user = await db.user.findUnique({
    where: { id: userId },
    select: {
      timezone: true,
      reminderTime: true,
      reminderEnabled: true,
      name: true,
      email: true,
      image: true,
    },
  })

  return user
}
