"use client"
import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CalendarCheck, FileText, Award, BookOpen } from "lucide-react"
import { examsApi, lmsApi } from "@/lib/api"

export default function StudentDashboardPage() {
  const [attendance] = React.useState({ present: 18, absent: 2, late: 1, rate: "86%" })
  const [exams, setExams] = React.useState<any[]>([])
  const [assignments, setAssignments] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsRes, assignmentsRes] = await Promise.all([
          examsApi.list({ status: "upcoming" }), lmsApi.assignments(),
        ])
        if (examsRes.data) setExams((examsRes.data as any).exams || [])
        if (assignmentsRes.data) setAssignments(assignmentsRes.data as any[])
      } catch { setExams([]); setAssignments([]) }
      finally { setLoading(false) }
    }
    fetchData()
  }, [])
  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here&apos;s your academic overview.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Attendance Rate</CardTitle>
            <CalendarCheck className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{attendance.rate}</div></CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Present Days</CardTitle>
            <Award className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{attendance.present}</div></CardContent>
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
            <CardTitle className="text-sm font-medium">Pending Assignments</CardTitle>
            <BookOpen className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent><div className="text-2xl font-bold">{assignments.length}</div></CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader><CardTitle>Upcoming Exams</CardTitle><CardDescription>Your scheduled examinations</CardDescription></CardHeader>
          <CardContent>
            {exams.length === 0 ? <p className="text-sm text-muted-foreground">No upcoming exams</p> : (
              <div className="space-y-3">
                {exams.slice(0, 5).map((exam: any, i: number) => (
                  <div key={i} className="flex items-center justify-between border-b pb-2 last:border-0">
                    <div><p className="text-sm font-medium">{exam.name}</p><p className="text-xs text-muted-foreground">{exam.subject?.name}</p></div>
                    <Badge variant="outline">{new Date(exam.startDate).toLocaleDateString()}</Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader><CardTitle>Recent Marks</CardTitle><CardDescription>Your latest exam results</CardDescription></CardHeader>
          <CardContent><p className="text-sm text-muted-foreground">No recent marks available</p></CardContent>
        </Card>
      </div>
    </div>
  )
}
