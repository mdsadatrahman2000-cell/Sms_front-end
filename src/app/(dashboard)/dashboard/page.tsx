"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { GraduationCap, Users, BookOpen, DollarSign, TrendingUp, AlertTriangle } from "lucide-react"

const stats = [
  {
    title: "Total Students",
    value: "1,234",
    description: "+12% from last month",
    icon: GraduationCap,
    trend: "up",
  },
  {
    title: "Total Teachers",
    value: "56",
    description: "+2 new this month",
    icon: Users,
    trend: "up",
  },
  {
    title: "Active Courses",
    value: "48",
    description: "12 departments",
    icon: BookOpen,
    trend: "up",
  },
  {
    title: "Fee Collection",
    value: "$124,500",
    description: "85% collected",
    icon: DollarSign,
    trend: "up",
  },
]

const recentActivities = [
  { title: "New student enrolled", time: "2 minutes ago", type: "success" },
  { title: "Exam results published", time: "15 minutes ago", type: "info" },
  { title: "Fee payment received", time: "1 hour ago", type: "success" },
  { title: "Low attendance alert", time: "2 hours ago", type: "warning" },
  { title: "Teacher leave request", time: "3 hours ago", type: "info" },
]

const upcomingEvents = [
  { title: "Parent-Teacher Meeting", date: "Jul 20, 2026", type: "meeting" },
  { title: "Mid-term Examinations", date: "Aug 1-15, 2026", type: "exam" },
  { title: "Annual Day Celebration", date: "Aug 25, 2026", type: "event" },
  { title: "Independence Day Holiday", date: "Aug 15, 2026", type: "holiday" },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening at your school.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <p className="text-xs text-muted-foreground">
                {stat.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>
              Latest activities across the school
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div className="flex items-center gap-2">
                    {activity.type === "warning" ? (
                      <AlertTriangle className="h-4 w-4 text-yellow-500" />
                    ) : activity.type === "success" ? (
                      <TrendingUp className="h-4 w-4 text-green-500" />
                    ) : (
                      <TrendingUp className="h-4 w-4 text-blue-500" />
                    )}
                    <span className="text-sm">{activity.title}</span>
                  </div>
                  <span className="text-xs text-muted-foreground">
                    {activity.time}
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Events</CardTitle>
            <CardDescription>
              Events scheduled for the next few weeks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingEvents.map((event, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between border-b pb-2 last:border-0"
                >
                  <div>
                    <p className="text-sm font-medium">{event.title}</p>
                    <p className="text-xs text-muted-foreground">
                      {event.date}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
