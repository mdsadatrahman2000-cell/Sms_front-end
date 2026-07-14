"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, BookOpen, DollarSign, TrendingUp, AlertTriangle, Clock, FileText } from "lucide-react"
import { dashboardApi } from "@/lib/api"

export default function DashboardPage() {
  const [stats, setStats] = React.useState<any>(null)
  const [recentActivity, setRecentActivity] = React.useState<any[]>([])
  const [upcomingEvents, setUpcomingEvents] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    Promise.all([
      dashboardApi.stats(),
      dashboardApi.recentActivity(),
      dashboardApi.upcomingEvents(),
    ]).then(([statsRes, activityRes, eventsRes]) => {
      if (statsRes.data) setStats(statsRes.data)
      if (activityRes.data) setRecentActivity(activityRes.data as any[])
      if (eventsRes.data) setUpcomingEvents(eventsRes.data as any[])
      setLoading(false)
    })
  }, [])

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Loading dashboard...</p>
      </div>
    )
  }

  const statCards = [
    {
      title: "Total Students",
      value: stats?.totalStudents || 0,
      icon: GraduationCap,
      color: "text-blue-500",
    },
    {
      title: "Total Teachers",
      value: stats?.totalTeachers || 0,
      icon: Users,
      color: "text-green-500",
    },
    {
      title: "Total Classes",
      value: stats?.totalClasses || 0,
      icon: BookOpen,
      color: "text-purple-500",
    },
    {
      title: "Total Revenue",
      value: `$${(stats?.totalRevenue || 0).toLocaleString()}`,
      icon: DollarSign,
      color: "text-emerald-500",
    },
    {
      title: "Pending Fees",
      value: `$${(stats?.pendingFees || 0).toLocaleString()}`,
      icon: AlertTriangle,
      color: "text-orange-500",
    },
    {
      title: "Documents",
      value: stats?.totalDocuments || 0,
      icon: FileText,
      color: "text-cyan-500",
    },
    {
      title: "Guardians",
      value: stats?.totalGuardians || 0,
      icon: Users,
      color: "text-pink-500",
    },
    {
      title: "Subjects",
      value: stats?.totalSubjects || 0,
      icon: BookOpen,
      color: "text-indigo-500",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here&apos;s what&apos;s happening at your school.
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.slice(0, 4).map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {statCards.slice(4).map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
              <stat.icon className={`h-4 w-4 ${stat.color}`} />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {stats?.attendanceToday && (
        <Card>
          <CardHeader>
            <CardTitle>Today&apos;s Attendance</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-6">
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-green-500" />
                <span className="text-sm">Present: {stats.attendanceToday.present}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-red-500" />
                <span className="text-sm">Absent: {stats.attendanceToday.absent}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-3 w-3 rounded-full bg-yellow-500" />
                <span className="text-sm">Late: {stats.attendanceToday.late}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4">
          <CardHeader>
            <CardTitle>Recent Activities</CardTitle>
            <CardDescription>Latest activities across the school</CardDescription>
          </CardHeader>
          <CardContent>
            {recentActivity.length === 0 ? (
              <p className="text-sm text-muted-foreground">No recent activities</p>
            ) : (
              <div className="space-y-4">
                {recentActivity.map((activity: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2">
                      {activity.type === "enrollment" ? (
                        <GraduationCap className="h-4 w-4 text-blue-500" />
                      ) : activity.type === "teacher" ? (
                        <Users className="h-4 w-4 text-green-500" />
                      ) : (
                        <DollarSign className="h-4 w-4 text-emerald-500" />
                      )}
                      <span className="text-sm">{activity.title}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {new Date(activity.date).toLocaleDateString()}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="col-span-3">
          <CardHeader>
            <CardTitle>Upcoming Exams</CardTitle>
            <CardDescription>Scheduled examinations</CardDescription>
          </CardHeader>
          <CardContent>
            {upcomingEvents.length === 0 ? (
              <p className="text-sm text-muted-foreground">No upcoming exams</p>
            ) : (
              <div className="space-y-4">
                {upcomingEvents.map((event: any, index: number) => (
                  <div key={index} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div>
                      <p className="text-sm font-medium">{event.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {event.class?.name} - {event.subject?.name}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-xs">{new Date(event.startDate).toLocaleDateString()}</p>
                      <Badge variant="outline" className="text-xs">{event.totalMarks} marks</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
