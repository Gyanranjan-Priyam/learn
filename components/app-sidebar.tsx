"use client"

import * as React from "react"
import Link from "next/link"

import { NavMain } from "@/components/nav-main"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { 
  LayoutDashboardIcon, 
  FlameIcon, 
  CalendarIcon, 
  TrophyIcon,
  Settings2Icon, 
  CircleHelpIcon, 
  BarChart3Icon,
  PlusCircleIcon
} from "lucide-react"

const navMain = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon />,
  },
  {
    title: "My Streaks",
    url: "/dashboard/streaks",
    icon: <FlameIcon />,
  },
  {
    title: "Calendar",
    url: "/dashboard/calendar",
    icon: <CalendarIcon />,
  },
  {
    title: "Achievements",
    url: "/dashboard/achievements",
    icon: <TrophyIcon />,
  },
  {
    title: "Analytics",
    url: "/dashboard/analytics",
    icon: <BarChart3Icon />,
  },
]

const navSecondary = [
  {
    title: "Settings",
    url: "/dashboard/settings",
    icon: <Settings2Icon />,
  },
  {
    title: "Help",
    url: "/help",
    icon: <CircleHelpIcon />,
  },
]

interface AppSidebarProps extends React.ComponentProps<typeof Sidebar> {
  user?: {
    name: string
    email: string
    image?: string | null
  }
}

export function AppSidebar({ user, ...props }: AppSidebarProps) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-orange-500">
                  <FlameIcon className="h-4 w-4 text-white" />
                </div>
                <span className="text-base font-semibold">StreakForge</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        {/* Quick action button */}
        <div className="px-2 mb-2">
          <SidebarMenuButton
            asChild
            className="w-full justify-start gap-2 bg-orange-500 hover:bg-orange-600 text-white data-[slot=sidebar-menu-button]:!p-2"
          >
            <Link href="/dashboard/streaks/new">
              <PlusCircleIcon className="h-4 w-4" />
              <span>New Streak</span>
            </Link>
          </SidebarMenuButton>
        </div>
        <NavMain items={navMain} />
        <NavSecondary items={navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser 
          user={{
            name: user?.name ?? "Guest",
            email: user?.email ?? "",
            avatar: user?.image ?? "",
          }} 
        />
      </SidebarFooter>
    </Sidebar>
  )
}
