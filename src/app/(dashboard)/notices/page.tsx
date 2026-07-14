"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { notificationsApi } from "@/lib/api"
import { Bell, Check } from "lucide-react"

export default function NoticesPage() {
  const [notices, setNotices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    notificationsApi.list().then((res) => {
      const d = res.data
      setNotices(Array.isArray(d) ? d : (d as any)?.notices || [])
      setLoading(false)
    })
  }, [])

  const handleMarkRead = async (id: string) => {
    await notificationsApi.markAsRead(id)
    setNotices(notices.map((n) => n.id === id ? { ...n, read: true } : n))
  }

  const typeBadge = (type: string) => {
    switch (type) {
      case "urgent": return <Badge variant="destructive">Urgent</Badge>
      case "exam": return <Badge className="bg-blue-100 text-blue-800">Exam</Badge>
      case "event": return <Badge className="bg-purple-100 text-purple-800">Event</Badge>
      default: return <Badge variant="outline">General</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notices</h1>
        <p className="text-muted-foreground">School announcements and notifications</p>
      </div>

      <div className="space-y-3">
        {notices.map((notice: any) => (
          <Card key={notice.id} className={notice.read ? "opacity-60" : ""}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base flex items-center gap-2">
                  <Bell className="h-4 w-4" /> {notice.title}
                </CardTitle>
                <div className="flex items-center gap-2">
                  {typeBadge(notice.type || notice.priority)}
                  {!notice.read && (
                    <Button size="sm" variant="outline" onClick={() => handleMarkRead(notice.id)}>
                      <Check className="h-3 w-3 mr-1" /> Mark Read
                    </Button>
                  )}
                </div>
              </div>
              <CardDescription>{new Date(notice.createdAt).toLocaleDateString()}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">{notice.message || notice.content}</p>
            </CardContent>
          </Card>
        ))}
        {notices.length === 0 && !loading && (
          <Card><CardContent className="py-8 text-center text-muted-foreground">No notices found</CardContent></Card>
        )}
      </div>
    </div>
  )
}
