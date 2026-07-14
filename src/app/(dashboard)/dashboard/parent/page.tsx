"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, CalendarCheck, DollarSign, Bell } from "lucide-react"
import { feesApi, notificationsApi } from "@/lib/api"
export default function ParentDashboardPage() {
  const [children] = React.useState([
    { id: "1", name: "John Smith", class: "Grade 5A", attendance: "92%" },
    { id: "2", name: "Emma Smith", class: "Grade 3B", attendance: "88%" },
  ])
  const [fees, setFees] = React.useState<any>(null)
  const [notifications, setNotifications] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [feesRes, notifRes] = await Promise.all([
          feesApi.revenue(), notificationsApi.list(),
        ])
        if (feesRes.data) setFees(feesRes.data)
        if (notifRes.data) setNotifications(notifRes.data as any[])
      } catch { setFees({ collected: 0, pending: 0 }) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])
  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Parent Dashboard</h1>
        <p className="text-muted-foreground">Monitor your children&apos;s academic progress.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Children</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{children.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Attendance</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">90%</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fees Paid</CardTitle>
            <DollarSign className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">${(fees?.collected || 0).toLocaleString()}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Fees</CardTitle>
            <DollarSign className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">${(fees?.pending || 0).toLocaleString()}</div></CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>My Children</CardTitle><CardDescription>Academic overview</CardDescription></CardHeader>
          <CardContent>
            {children.length === 0 ? <p className="text-sm text-muted-foreground">No children linked</p> : (
              <div className="space-y-3">
                {children.map((child) => (
                  <div key={child.id} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div><p className="text-sm font-medium">{child.name}</p><p className="text-xs text-muted-foreground">{child.class}</p></div>
                    <Badge variant="outline">{child.attendance}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Notifications</CardTitle><CardDescription>Recent updates from school</CardDescription></CardHeader>
          <CardContent>
            {notifications.length === 0 ? <p className="text-sm text-muted-foreground">No notifications</p> : (
              <div className="space-y-3">
                {notifications.slice(0, 5).map((notif: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div className="flex items-center gap-2"><Bell className="h-4 w-4 text-muted-foreground" /><span className="text-sm">{notif.title || notif.message}</span></div>
                    <Badge variant="outline">{notif.type || "info"}</Badge>
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
