// Milestones that trigger celebration emails
export const MILESTONES = [5, 10, 15, 20, 25, 30, 60, 90, 100] as const

export type MilestoneDay = (typeof MILESTONES)[number]

export const MILESTONE_MESSAGES: Record<
  MilestoneDay,
  { headline: string; subtext: string; emoji: string }
> = {
  5: {
    headline: "First checkpoint cleared!",
    subtext: "The hardest part is starting. You did that.",
    emoji: "🌱",
  },
  10: {
    headline: "Double digits!",
    subtext: "You've built a real habit loop.",
    emoji: "🎯",
  },
  15: {
    headline: "Two weeks strong!",
    subtext: "Science says habits cement around day 14. You're locked in.",
    emoji: "💪",
  },
  20: {
    headline: "Three-week warrior!",
    subtext: "Consistency is the new superpower.",
    emoji: "⚡",
  },
  25: {
    headline: "Almost a month!",
    subtext: "Only 5 more days to the big 30.",
    emoji: "🏃",
  },
  30: {
    headline: "One month of showing up!",
    subtext: "This isn't luck — it's discipline.",
    emoji: "🏆",
  },
  60: {
    headline: "Two months nonstop!",
    subtext: "You're in rare company now.",
    emoji: "🔥",
  },
  90: {
    headline: "A full quarter of commitment!",
    subtext: "90 days builds identity, not just routine.",
    emoji: "👑",
  },
  100: {
    headline: "LEGENDARY — 100 days!",
    subtext: "You've proven anything is possible.",
    emoji: "🌟",
  },
}

// Streak color palette for UI
export const STREAK_COLORS = [
  { value: "#F97316", label: "Orange", name: "flame" },
  { value: "#EF4444", label: "Red", name: "ember" },
  { value: "#F59E0B", label: "Amber", name: "gold" },
  { value: "#22C55E", label: "Green", name: "growth" },
  { value: "#10B981", label: "Emerald", name: "mint" },
  { value: "#14B8A6", label: "Teal", name: "ocean" },
  { value: "#3B82F6", label: "Blue", name: "sky" },
  { value: "#6366F1", label: "Indigo", name: "cosmic" },
  { value: "#8B5CF6", label: "Violet", name: "mystic" },
  { value: "#EC4899", label: "Pink", name: "rose" },
  { value: "#F43F5E", label: "Rose", name: "blush" },
  { value: "#64748B", label: "Slate", name: "steel" },
] as const

// Streak emoji options
export const STREAK_EMOJIS = [
  "🔥", // Fire (default)
  "⚡", // Lightning
  "🎯", // Target
  "💪", // Strength
  "🏃", // Running
  "📚", // Books
  "✍️", // Writing
  "🎨", // Art
  "🎸", // Music
  "💻", // Code
  "🏋️", // Workout
  "🧘", // Meditation
  "💧", // Water
  "🌱", // Growth
  "☀️", // Morning
  "🌙", // Night
  "💊", // Health
  "🎮", // Gaming
  "🗣️", // Speaking
  "📝", // Notes
] as const

// Default values for new streaks
export const STREAK_DEFAULTS = {
  color: "#F97316",
  emoji: "🔥",
  targetDays: 30,
  freezesAllowed: 2,
}

// Popular preset streak templates
export const STREAK_PRESETS = [
  {
    name: "30-Day Challenge",
    description: "Build a new habit in 30 days",
    targetDays: 30,
    emoji: "🔥",
    color: "#F97316",
  },
  {
    name: "100-Day Journey",
    description: "Transform your life in 100 days",
    targetDays: 100,
    emoji: "🌟",
    color: "#8B5CF6",
  },
  {
    name: "21-Day Starter",
    description: "The classic habit formation period",
    targetDays: 21,
    emoji: "🌱",
    color: "#22C55E",
  },
  {
    name: "66-Day Habit",
    description: "Research-backed habit automation",
    targetDays: 66,
    emoji: "🎯",
    color: "#3B82F6",
  },
  {
    name: "Year-Long Quest",
    description: "Ultimate commitment - 365 days",
    targetDays: 365,
    emoji: "👑",
    color: "#F59E0B",
  },
] as const

// Timezone options for user settings
export const POPULAR_TIMEZONES = [
  { value: "America/New_York", label: "Eastern Time (ET)" },
  { value: "America/Chicago", label: "Central Time (CT)" },
  { value: "America/Denver", label: "Mountain Time (MT)" },
  { value: "America/Los_Angeles", label: "Pacific Time (PT)" },
  { value: "America/Anchorage", label: "Alaska Time (AKT)" },
  { value: "Pacific/Honolulu", label: "Hawaii Time (HT)" },
  { value: "Europe/London", label: "London (GMT/BST)" },
  { value: "Europe/Paris", label: "Central European (CET)" },
  { value: "Europe/Berlin", label: "Berlin (CET)" },
  { value: "Asia/Tokyo", label: "Japan (JST)" },
  { value: "Asia/Shanghai", label: "China (CST)" },
  { value: "Asia/Kolkata", label: "India (IST)" },
  { value: "Asia/Dubai", label: "Dubai (GST)" },
  { value: "Australia/Sydney", label: "Sydney (AEST)" },
  { value: "Pacific/Auckland", label: "New Zealand (NZST)" },
  { value: "UTC", label: "UTC" },
] as const

// Reminder time options (24h format)
export const REMINDER_TIMES = [
  { value: "06:00", label: "6:00 AM" },
  { value: "07:00", label: "7:00 AM" },
  { value: "08:00", label: "8:00 AM" },
  { value: "09:00", label: "9:00 AM" },
  { value: "10:00", label: "10:00 AM" },
  { value: "12:00", label: "12:00 PM" },
  { value: "14:00", label: "2:00 PM" },
  { value: "17:00", label: "5:00 PM" },
  { value: "18:00", label: "6:00 PM" },
  { value: "19:00", label: "7:00 PM" },
  { value: "20:00", label: "8:00 PM" },
  { value: "21:00", label: "9:00 PM" },
] as const
