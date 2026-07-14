"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { GraduationCap, Users, BookOpen, DollarSign, TrendingUp, Clock } from "lucide-react"
import { dashboardApi } from "@/lib/api"

export default function PrincipalDashboardPage() {
  const [stats, setStats] = React.useState<any>(null)
  const [recentActivity, setRecentActivity] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, activityRes] = await Promise.all([
          dashboardApi.stats(),
          dashboardApi.recentActivity(),
        ])
        if (statsRes.data) setStats(statsRes.data)
        if (activityRes.data) setRecentActivity(activityRes.data as any[])
      } catch {
        setStats({ totalStudents: 0, totalTeachers: 0, totalClasses: 0, totalRevenue: 0, attendanceRate: 0 })
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])
  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>
  const statCards = [
    { title: "Total Students", value: stats?.totalStudents || 0, icon: GraduationCap, color: "text-blue-500" },
    { title: "Total Teachers", value: stats?.totalTeachers || 0, icon: Users, color: "text-green-500" },
    { title: "Total Classes", value: stats?.totalClasses || 0, icon: BookOpen, color: "text-purple-500" },
    { title: "Attendance Rate", value: `${stats?.attendanceRate || 0}%`, icon: TrendingUp, color: "text-emerald-500" },
    { title: "Revenue", value: `$${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: "text-cyan-500" },
  ]
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Principal Dashboard</h1>
        <p className="text-muted-foreground">Overview of your school&apos;s performance and metrics.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        {statCards.map((stat) => (
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

      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest events across the school</CardDescription>
        </CardHeader>
        <CardContent>
          {recentActivity.length === 0 ? (
            <p className="text-sm text-muted-foreground">No recent activity</p>
          ) : (
            <div className="space-y-3">
              {recentActivity.slice(0, 5).map((item: any, i: number) => (
                <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">{item.title}</span>
                  </div>
                  <Badge variant="outline">{item.type}</Badge>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
