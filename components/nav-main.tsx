"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { PlusCircleIcon } from "lucide-react"
import Link from "next/link"

export function NavMain({
  items,
}: {
  items: {
    title: string
    url: string
    icon?: React.ReactNode
  }[]
}) {
  return (
    <SidebarGroup>
      <SidebarGroupContent className="flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center gap-2">
             <Link
            href="/dashboard/streaks/new"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-dashed border-orange-300 bg-orange-50 px-3 py-2 text-sm font-medium text-orange-600 transition-colors hover:border-orange-400 hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/50 dark:text-orange-400 dark:hover:border-orange-700 dark:hover:bg-orange-950"
          >
            <PlusCircleIcon className="h-4 w-4" />
            New Streak
          </Link>
          </SidebarMenuItem>
        </SidebarMenu>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton className="data-[slot=sidebar-menu-button]:!p-1.5 cursor-pointer m-1" tooltip={item.title}>

                {item.icon}

                <Link href={item.url} className="flex-1">
                  {item.title}
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  )
}
