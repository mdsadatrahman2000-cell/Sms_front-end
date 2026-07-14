"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { notificationsApi } from "@/lib/api"
import { Bell } from "lucide-react"

export default function NoticesPage() {
  const [notices, setNotices] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    notificationsApi.notices().then((res) => {
      if (res.data) setNotices(res.data as any[])
      setLoading(false)
    })
  }, [])

  const priorityBadge = (priority: string) => {
    switch (priority) {
      case "urgent": return <Badge variant="destructive">Urgent</Badge>
      case "high": return <Badge className="bg-orange-100 text-orange-800">High</Badge>
      default: return <Badge variant="outline">Normal</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Notices</h1>
        <p className="text-muted-foreground">School announcements and notifications</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5" /> Notices & Announcements
          </CardTitle>
          <CardDescription>{notices.length} notices</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Content</TableHead>
                <TableHead>Priority</TableHead>
                <TableHead>Audience</TableHead>
                <TableHead>Date</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {notices.map((notice: any) => (
                <TableRow key={notice.id}>
                  <TableCell className="font-medium">{notice.title}</TableCell>
                  <TableCell className="max-w-md truncate">{notice.content}</TableCell>
                  <TableCell>{priorityBadge(notice.priority)}</TableCell>
                  <TableCell>
                    {notice.targetAudience?.length > 0
                      ? notice.targetAudience.join(", ")
                      : "All"}
                  </TableCell>
                  <TableCell className="text-sm text-muted-foreground">
                    {new Date(notice.createdAt).toLocaleDateString()}
                  </TableCell>
                </TableRow>
              ))}
              {notices.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No notices found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
