import { Metadata } from "next"
import { notFound, redirect } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Trash2 } from "lucide-react"
import { requireAuth } from "@/lib/queries"
import { getStreakById, deleteStreak } from "@/actions/streak"
import { SiteHeader } from "@/components/site-header"
import { AppSidebar } from "@/components/app-sidebar"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { StreakForm } from "@/components/streak/StreakForm"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface StreakSettingsPageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: StreakSettingsPageProps): Promise<Metadata> {
  const { id } = await params
  const streak = await getStreakById(id)

  if (!streak) {
    return { title: "Streak Not Found | StreakForge" }
  }

  return {
    title: `Edit ${streak.name} | StreakForge`,
    description: `Edit settings for ${streak.name}`,
  }
}

export default async function StreakSettingsPage({
  params,
}: StreakSettingsPageProps) {
  const { id } = await params
  const session = await requireAuth()
  const streak = await getStreakById(id)

  if (!streak) {
    notFound()
  }

  return (
    <SidebarProvider>
      <AppSidebar
        variant="inset"
        user={{
          name: session.user.name || "User",
          email: session.user.email,
          image: session.user.image || undefined,
        }}
      />
      <SidebarInset>
        <SiteHeader title="Streak Settings" />
        <main className="flex-1 overflow-auto">
          <div className="container max-w-2xl py-8 px-4 sm:px-6">
            {/* Back link */}
            <Link
              href={`/dashboard/streaks/${streak.id}`}
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Streak
            </Link>

            {/* Header */}
            <div className="mb-8">
              <div className="flex items-center gap-3">
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                  style={{ backgroundColor: `${streak.color}15` }}
                >
                  {streak.emoji}
                </div>
                <div>
                  <h1 className="text-2xl font-black tracking-tight">
                    Edit {streak.name}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    Customize your streak settings
                  </p>
                </div>
              </div>
            </div>

            {/* Edit Form */}
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Streak Details</CardTitle>
                <CardDescription>
                  Update your streak name, target, and appearance
                </CardDescription>
              </CardHeader>
              <CardContent>
                <StreakForm
                  mode="edit"
                  initialData={{
                    id: streak.id,
                    name: streak.name,
                    description: streak.description,
                    targetDays: streak.targetDays,
                    color: streak.color,
                    emoji: streak.emoji,
                    freezesAllowed: streak.freezesAllowed,
                  }}
                />
              </CardContent>
            </Card>

            {/* Danger Zone */}
            <Card className="border-red-500/30 bg-red-500/5">
              <CardHeader>
                <CardTitle className="text-red-500">Danger Zone</CardTitle>
                <CardDescription>
                  Irreversible actions that will permanently affect your streak
                </CardDescription>
              </CardHeader>
              <CardContent>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="destructive">
                      <Trash2 className="w-4 h-4 mr-2" />
                      Delete Streak
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete
                        your streak <strong>{streak.name}</strong> and all{" "}
                        {streak.checkIns.length} check-ins associated with it.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <form
                        action={async () => {
                          "use server"
                          await deleteStreak(id)
                          redirect("/dashboard")
                        }}
                      >
                        <AlertDialogAction
                          type="submit"
                          className="bg-red-500 hover:bg-red-600"
                        >
                          Delete
                        </AlertDialogAction>
                      </form>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </CardContent>
            </Card>
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
