"use client"

import * as React from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  BookOpen,
  Calendar,
  ClipboardList,
  Settings,
  LogOut,
  Bell,
  Search,
  Menu,
  ChevronDown,
  School,
  DollarSign,
  Bus,
  Building,
  Package,
  Megaphone,
  Shield,
  BarChart3,
} from "lucide-react"
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarItem,
  SidebarGroup,
  SidebarGroupLabel,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { ThemeToggle } from "@/components/theme-toggle"
import { Input } from "@/components/ui/input"

const navigation = [
  {
    group: "Main",
    items: [
      { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
      { label: "Principal View", href: "/dashboard/principal", icon: BarChart3 },
      { label: "Teacher View", href: "/dashboard/teacher", icon: BarChart3 },
      { label: "Student View", href: "/dashboard/student", icon: BarChart3 },
      { label: "Parent View", href: "/dashboard/parent", icon: BarChart3 },
      { label: "Students", href: "/students", icon: GraduationCap },
      { label: "Teachers", href: "/teachers", icon: Users },
      { label: "Classes", href: "/classes", icon: School },
      { label: "Subjects", href: "/subjects", icon: BookOpen },
      { label: "Guardians", href: "/guardians", icon: Users },
    ],
  },
  {
    group: "Academic",
    items: [
      { label: "Academic Years", href: "/academic-years", icon: Calendar },
      { label: "Attendance", href: "/attendances", icon: ClipboardList },
      { label: "Attendance Analytics", href: "/attendances/analytics", icon: BarChart3 },
      { label: "Exams", href: "/exams", icon: ClipboardList },
      { label: "Reports", href: "/reports", icon: BarChart3 },
      { label: "LMS", href: "/lms", icon: BookOpen },
      { label: "Timetable", href: "/timetable", icon: Calendar },
      { label: "Notices", href: "/notices", icon: Megaphone },
    ],
  },
  {
    group: "Finance",
    items: [
      { label: "Fees", href: "/fees", icon: DollarSign },
    ],
  },
  {
    group: "Operations",
    items: [
      { label: "HR & Staff", href: "/hr", icon: Users },
      { label: "Leaves", href: "/leaves", icon: ClipboardList },
      { label: "Admissions", href: "/admissions", icon: GraduationCap },
      { label: "Scholarships", href: "/scholarships", icon: DollarSign },
      { label: "Library", href: "/library", icon: BookOpen },
      { label: "Transport", href: "/transport", icon: Bus },
      { label: "Hostel", href: "/hostel", icon: Building },
      { label: "Inventory", href: "/inventory", icon: Package },
    ],
  },
  {
    group: "System",
    items: [
      { label: "Tenants", href: "/tenants", icon: School },
      { label: "Roles", href: "/roles", icon: Shield },
      { label: "Settings", href: "/settings", icon: Settings },
    ],
  },
]

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = React.useState(true)

  return (
    <div className="flex h-screen overflow-hidden">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-2 focus:bg-background focus:border">
        Skip to main content
      </a>

      <Sidebar className={`${sidebarOpen ? "w-64" : "w-16"} transition-all duration-300 hidden md:block`}>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <School className="h-5 w-5" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-bold">School ERP</span>
            )}
          </div>
        </SidebarHeader>

        <SidebarContent>
          {navigation.map((group) => (
            <SidebarGroup key={group.group}>
              {sidebarOpen && (
                <SidebarGroupLabel>{group.group}</SidebarGroupLabel>
              )}
              {group.items.map((item) => (
                <Link key={item.href} href={item.href}>
                  <SidebarItem
                    icon={<item.icon className="h-4 w-4" />}
                    active={pathname === item.href}
                  >
                    {sidebarOpen && item.label}
                  </SidebarItem>
                </Link>
              ))}
            </SidebarGroup>
          ))}
        </SidebarContent>

        <SidebarFooter>
          <SidebarItem icon={<LogOut className="h-4 w-4" />}>
            {sidebarOpen && "Logout"}
          </SidebarItem>
        </SidebarFooter>
      </Sidebar>

      <div className="flex flex-1 flex-col overflow-hidden">
        <header className="flex h-14 items-center justify-between border-b bg-background px-4">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="hidden md:flex"
            >
              <Menu className="h-5 w-5" />
            </Button>
            <div className="relative hidden sm:block">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search..."
                className="w-64 pl-8"
              />
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button variant="ghost" size="icon">
              <Bell className="h-5 w-5" />
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <div className="flex items-center gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/avatars/admin.png" alt="Admin" />
                <AvatarFallback>AD</AvatarFallback>
              </Avatar>
              <div className="text-sm hidden sm:block">
                <p className="font-medium">Admin User</p>
                <p className="text-muted-foreground">Super Admin</p>
              </div>
              <ChevronDown className="h-4 w-4 text-muted-foreground" />
            </div>
          </div>
        </header>

        <main id="main-content" className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
