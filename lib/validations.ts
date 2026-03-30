import { z } from "zod"
import { STREAK_COLORS, STREAK_EMOJIS } from "./constants"

// Extract valid color values
const validColors = STREAK_COLORS.map((c) => c.value) as [string, ...string[]]

// Streak creation schema
export const createStreakSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less"),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .optional(),
  targetDays: z
    .number()
    .int()
    .min(1, "Target must be at least 1 day")
    .max(365, "Target cannot exceed 365 days"),
  color: z.string().refine((val) => validColors.includes(val), {
    message: "Invalid color selection",
  }),
  emoji: z.string().refine((val) => (STREAK_EMOJIS as readonly string[]).includes(val), {
    message: "Invalid emoji selection",
  }),
  freezesAllowed: z.number().int().min(0).max(10).optional().default(2),
})

export type CreateStreakInput = z.infer<typeof createStreakSchema>

// Streak update schema
export const updateStreakSchema = z.object({
  name: z
    .string()
    .min(1, "Name is required")
    .max(50, "Name must be 50 characters or less")
    .optional(),
  description: z
    .string()
    .max(200, "Description must be 200 characters or less")
    .nullable()
    .optional(),
  color: z
    .string()
    .refine((val) => validColors.includes(val), {
      message: "Invalid color selection",
    })
    .optional(),
  emoji: z
    .string()
    .refine((val) => (STREAK_EMOJIS as readonly string[]).includes(val), {
      message: "Invalid emoji selection",
    })
    .optional(),
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "ABANDONED"]).optional(),
  freezesAllowed: z.number().int().min(0).max(10).optional(),
})

export type UpdateStreakInput = z.infer<typeof updateStreakSchema>

// Check-in schema
export const checkInSchema = z.object({
  streakId: z.string().min(1, "Streak ID is required"),
  note: z.string().max(500, "Note must be 500 characters or less").optional(),
  date: z.coerce.date().optional(), // Optional, defaults to today
})

export type CheckInInput = z.infer<typeof checkInSchema>

// Freeze usage schema
export const useFreezeSchema = z.object({
  streakId: z.string().min(1, "Streak ID is required"),
  date: z.coerce.date().optional(), // Optional, defaults to yesterday
})

export type UseFreezeInput = z.infer<typeof useFreezeSchema>

// User settings schema
export const updateUserSettingsSchema = z.object({
  timezone: z.string().min(1, "Timezone is required").optional(),
  reminderTime: z
    .string()
    .regex(/^([01]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format (HH:mm)")
    .optional(),
  reminderEnabled: z.boolean().optional(),
})

export type UpdateUserSettingsInput = z.infer<typeof updateUserSettingsSchema>

// Streak ID param schema
export const streakIdSchema = z.object({
  id: z.string().min(1, "Streak ID is required"),
})

// Pagination schema
export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
})

// Streak filter schema
export const streakFilterSchema = z.object({
  status: z.enum(["ACTIVE", "PAUSED", "COMPLETED", "ABANDONED", "ALL"]).optional(),
  sort: z.enum(["createdAt", "currentStreak", "name", "targetDays"]).optional(),
  order: z.enum(["asc", "desc"]).optional(),
})

export type StreakFilter = z.infer<typeof streakFilterSchema>

// Calendar sync schema
export const googleCalendarSyncSchema = z.object({
  streakId: z.string().min(1, "Streak ID is required"),
  enabled: z.boolean(),
})

export type GoogleCalendarSyncInput = z.infer<typeof googleCalendarSyncSchema>

// Share page params schema
export const sharePageSchema = z.object({
  id: z.string().min(1),
  icalSecret: z.string().min(1),
})
