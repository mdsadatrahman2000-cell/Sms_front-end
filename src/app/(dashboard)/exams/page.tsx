"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { examsApi } from "@/lib/api"
import { Plus, Eye, Trash2 } from "lucide-react"

export default function ExamsPage() {
  const [exams, setExams] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    examsApi.list().then((res) => {
      if (res.data) setExams((res.data as any).exams || [])
      setLoading(false)
    })
  }, [])

  const typeBadge = (type: string) => {
    const variants: Record<string, string> = {
      midterm: "bg-blue-100 text-blue-800",
      final: "bg-red-100 text-red-800",
      quiz: "bg-green-100 text-green-800",
      assignment: "bg-purple-100 text-purple-800",
    }
    return <Badge className={variants[type] || ""}>{type}</Badge>
  }

  const statusBadge = (status: string) => {
    const variants: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
      draft: "secondary",
      published: "default",
      completed: "outline",
    }
    return <Badge variant={variants[status] || "outline"}>{status}</Badge>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Examinations</h1>
          <p className="text-muted-foreground">Manage exams, quizzes, and assessments</p>
        </div>
        <Button><Plus className="h-4 w-4 mr-2" /> New Exam</Button>
      </div>

      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Class</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Marks</TableHead>
                <TableHead>Dates</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Students</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {exams.map((exam: any) => (
                <TableRow key={exam.id}>
                  <TableCell className="font-medium">{exam.name}</TableCell>
                  <TableCell>{exam.class?.name} {exam.class?.section}</TableCell>
                  <TableCell>{exam.subject?.name}</TableCell>
                  <TableCell>{typeBadge(exam.type)}</TableCell>
                  <TableCell>{exam.totalMarks} (pass: {exam.passingMarks})</TableCell>
                  <TableCell className="text-xs">
                    {new Date(exam.startDate).toLocaleDateString()} - {new Date(exam.endDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>{statusBadge(exam.status)}</TableCell>
                  <TableCell>{exam._count?.marks || 0}</TableCell>
                </TableRow>
              ))}
              {exams.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-8 text-muted-foreground">
                    No exams found. Create your first exam to get started.
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
