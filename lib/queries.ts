import { db } from "@/lib/db"
import { auth } from "@/lib/auth"
import { headers } from "next/headers"
import { redirect } from "next/navigation"

export async function getSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  })
  return session
}

export async function requireAuth() {
  const session = await getSession()
  if (!session?.user) {
    redirect("/signin")
  }
  return session
}

export async function getUserStreaks(userId: string) {
  const streaks = await db.streak.findMany({
    where: { userId },
    include: {
      checkIns: {
        orderBy: { date: "desc" },
        take: 30,
      },
      milestones: {
        orderBy: { days: "desc" },
        take: 5,
      },
    },
    orderBy: { updatedAt: "desc" },
  })
  return streaks
}

export async function getDashboardStats(userId: string) {
  const [activeStreaks, totalCheckIns, completedStreaks] = await Promise.all([
    db.streak.count({
      where: { userId, status: "ACTIVE" },
    }),
    db.checkIn.count({
      where: { userId },
    }),
    db.streak.count({
      where: { userId, status: "COMPLETED" },
    }),
  ])

  // Get longest current streak
  const longestActive = await db.streak.findFirst({
    where: { userId, status: "ACTIVE" },
    orderBy: { currentStreak: "desc" },
    select: { currentStreak: true, name: true },
  })

  return {
    activeStreaks,
    totalCheckIns,
    completedStreaks,
    longestActiveStreak: longestActive?.currentStreak ?? 0,
    longestStreakName: longestActive?.name ?? null,
  }
}

export async function getRecentActivity(userId: string, limit = 10) {
  const checkIns = await db.checkIn.findMany({
    where: { userId },
    include: {
      streak: {
        select: { name: true, emoji: true, color: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: limit,
  })
  return checkIns
}
