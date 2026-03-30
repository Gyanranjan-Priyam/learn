import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { requireAuth, getDashboardStats, getUserStreaks, getRecentActivity } from "@/lib/queries"
import { DashboardContent } from "@/components/dashboard/dashboard-content"

export default async function DashboardPage() {
  const session = await requireAuth()
  const user = session.user
  
  const [stats, streaks, recentActivity] = await Promise.all([
    getDashboardStats(user.id),
    getUserStreaks(user.id),
    getRecentActivity(user.id),
  ])

  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar 
        variant="inset" 
        user={{
          name: user.name,
          email: user.email,
          image: user.image,
        }}
      />
      <SidebarInset>
        <SiteHeader title="Dashboard" />
        <DashboardContent 
          user={user}
          stats={stats}
          streaks={streaks}
          recentActivity={recentActivity}
        />
      </SidebarInset>
    </SidebarProvider>
  )
}
