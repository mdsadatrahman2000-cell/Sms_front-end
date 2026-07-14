"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, Users, FileText, Clock } from "lucide-react"
import { timetableApi, examsApi } from "@/lib/api"

export default function TeacherDashboardPage() {
  const [classes, setClasses] = React.useState<any[]>([])
  const [exams, setExams] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [timetableRes, examsRes] = await Promise.all([
          timetableApi.getMy(), examsApi.list({ status: "upcoming" }),
        ])
        if (timetableRes.data) setClasses(timetableRes.data as any[])
        if (examsRes.data) setExams((examsRes.data as any).exams || [])
      } catch { setClasses([]); setExams([]) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])
  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>
  const uniqueClasses = [...new Set(classes.map((c: any) => c.class?.name).filter(Boolean))]
  const totalStudents = classes.reduce((sum: number, c: any) => sum + (c.class?.studentCount || 0), 0)
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Teacher Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your teaching overview.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Classes Assigned</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{uniqueClasses.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Students</CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{totalStudents}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Upcoming Exams</CardTitle>
            <FileText className="h-4 w-4 text-orange-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{exams.length}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today&apos;s Sessions</CardTitle>
            <Clock className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{classes.length}</div></CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>My Classes</CardTitle><CardDescription>Today&apos;s timetable</CardDescription></CardHeader>
          <CardContent>
            {classes.length === 0 ? <p className="text-sm text-muted-foreground">No classes scheduled</p> : (
              <div className="space-y-3">
                {classes.slice(0, 5).map((item: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div><p className="text-sm font-medium">{item.class?.name}</p><p className="text-xs text-muted-foreground">{item.subject?.name}</p></div>
                    <Badge variant="outline">{item.startTime}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Upcoming Exams</CardTitle><CardDescription>Exams to prepare for</CardDescription></CardHeader>
          <CardContent>
            {exams.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming exams</p> : (
              <div className="space-y-3">
                {exams.slice(0, 5).map((exam: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div><p className="text-sm font-medium">{exam.name}</p><p className="text-xs text-muted-foreground">{exam.class?.name}</p></div>
                    <Badge variant="outline">{new Date(exam.startDate).toLocaleDateString()}</Badge>
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
