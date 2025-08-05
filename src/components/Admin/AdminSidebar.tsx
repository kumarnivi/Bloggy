import { useState } from "react"
import { Users, FileText, Settings, BarChart3, Shield, Home } from "lucide-react"
import { Link, useLocation } from "react-router-dom"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar"

const adminItems = [
  { title: "Overview", icon: BarChart3, section: "overview" },
  { title: "Posts Management", icon: FileText, section: "posts" },
  { title: "Users Management", icon: Users, section: "users" },
  { title: "Settings", icon: Settings, section: "settings" },
]

interface AdminSidebarProps {
  activeSection: string
  onSectionChange: (section: string) => void
}

export function AdminSidebar({ activeSection, onSectionChange }: AdminSidebarProps) {
  const { state } = useSidebar()
  const collapsed = state === "collapsed"

  const isActive = (section: string) => activeSection === section

  return (
    <Sidebar
      className={collapsed ? "w-14" : "w-60"}
      collapsible="icon"
    >
      <SidebarTrigger className="m-2 self-end mt-5" />

      <SidebarContent>
        <SidebarGroup>
          {/* <SidebarGroupLabel className="flex items-center gap-2 mt-5">
            <Shield className="h-4 w-4 " />
            {!collapsed && <span>Admin Panel</span>}
          </SidebarGroupLabel> */}

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton asChild>
                  <Link 
                    to="/" 
                    className="flex items-center gap-2 hover:bg-muted/50"
                  >
                    <Home className="h-4 w-4" />
                    {!collapsed && <span>Back to Site</span>}
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
              
              {adminItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <button
                      onClick={() => onSectionChange(item.section)}
                      className={`w-full flex items-center gap-2 ${
                        isActive(item.section) 
                          ? "bg-muted text-primary font-medium" 
                          : "hover:bg-muted/50"
                      }`}
                    >
                      <item.icon className="h-4 w-4" />
                      {!collapsed && <span>{item.title}</span>}
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}