"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { reportsApi, classesApi } from "@/lib/api"
import { BarChart3, Award, Users } from "lucide-react"

export default function ReportsPage() {
  const [classes, setClasses] = React.useState<any[]>([])
  const [selectedClass, setSelectedClass] = React.useState("")
  const [rankings, setRankings] = React.useState<any[]>([])
  const [reportCard, setReportCard] = React.useState<any>(null)
  const [selectedStudent, setSelectedStudent] = React.useState("")

  React.useEffect(() => { classesApi.list().then(res => { if (res.data) setClasses(Array.isArray(res.data) ? res.data : []) }) }, [])

  React.useEffect(() => {
    if (selectedClass) {
      reportsApi.classRankings(selectedClass).then(res => { if (res.data) setRankings(res.data as any[]) })
    }
  }, [selectedClass])

  React.useEffect(() => {
    if (selectedStudent) reportsApi.reportCard(selectedStudent).then(res => { if (res.data) setReportCard(res.data) })
  }, [selectedStudent])

  return (
    <div className="space-y-6">
      <div><h1 className="text-3xl font-bold tracking-tight">Reports & Results</h1><p className="text-muted-foreground">View report cards, class rankings, and GPA</p></div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Class Rankings</CardTitle><BarChart3 className="h-4 w-4 text-blue-500" /></CardHeader><CardContent>
          <Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select>
        </CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Report Card</CardTitle><Award className="h-4 w-4 text-green-500" /></CardHeader><CardContent>
          <Select value={selectedStudent} onValueChange={setSelectedStudent}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{rankings.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select>
        </CardContent></Card>
      </div>

      {rankings.length > 0 && (
        <Card><CardHeader><CardTitle>Class Rankings</CardTitle></CardHeader><CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>Rank</TableHead><TableHead>Student</TableHead><TableHead>Admission #</TableHead><TableHead>GPA</TableHead><TableHead>Total Marks</TableHead></TableRow></TableHeader>
            <TableBody>{rankings.map((r: any) => <TableRow key={r.id}><TableCell><Badge variant={r.rank <= 3 ? "default" : "outline"}>#{r.rank}</Badge></TableCell><TableCell className="font-medium">{r.name}</TableCell><TableCell>{r.admissionNumber}</TableCell><TableCell className="font-bold">{r.gpa}</TableCell><TableCell>{r.totalMarks}</TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent></Card>
      )}

      {reportCard && (
        <Card><CardHeader><CardTitle>Report Card: {reportCard.student?.name}</CardTitle><CardDescription>GPA: {reportCard.gpa} | Attendance: {reportCard.attendanceRate}%</CardDescription></CardHeader><CardContent className="p-0">
          <Table><TableHeader><TableRow><TableHead>Subject</TableHead><TableHead>Exam</TableHead><TableHead>Marks</TableHead><TableHead>Percentage</TableHead><TableHead>Grade</TableHead></TableRow></TableHeader>
            <TableBody>{reportCard.results?.map((r: any, i: number) => <TableRow key={i}><TableCell>{r.subject}</TableCell><TableCell>{r.exam}</TableCell><TableCell>{r.marks}/{r.totalMarks}</TableCell><TableCell>{r.percentage}%</TableCell><TableCell><Badge variant={r.grade === "A" ? "default" : r.grade === "F" ? "destructive" : "secondary"}>{r.grade}</Badge></TableCell></TableRow>)}</TableBody>
          </Table>
        </CardContent></Card>
      )}
    </div>
  )
}
