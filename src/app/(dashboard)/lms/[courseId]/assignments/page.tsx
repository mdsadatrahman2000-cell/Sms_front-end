"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { lmsApi } from "@/lib/api"

export default function CourseAssignmentsPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [assignments, setAssignments] = React.useState<any[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState({ title: "", description: "", totalMarks: "100", dueDate: "" })

  React.useEffect(() => { lmsApi.assignments().then(res => { if (res.data) setAssignments(res.data as any[]) }) }, [])

  const handleCreate = async () => {
    const result = await lmsApi.createAssignment({ ...form, totalMarks: Number(form.totalMarks), classId: "", subjectId: "", teacherId: "" })
    if (result.data) { setAssignments([result.data, ...assignments]); setShowForm(false); setForm({ title: "", description: "", totalMarks: "100", dueDate: "" }) }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lms/${courseId}`}><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1"><h1 className="text-3xl font-bold tracking-tight">Assignments</h1></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> New Assignment</Button>
      </div>

      {showForm && (
        <Card><CardContent className="pt-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
            <div className="space-y-2"><Label>Total Marks</Label><Input type="number" value={form.totalMarks} onChange={e => setForm({ ...form, totalMarks: e.target.value })} /></div>
            <div className="space-y-2"><Label>Due Date</Label><Input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="flex gap-2"><Button onClick={handleCreate}>Create</Button><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </CardContent></Card>
      )}

      <Card>
        <CardContent className="p-0 pt-4">
          <Table>
            <TableHeader><TableRow><TableHead>Title</TableHead><TableHead>Marks</TableHead><TableHead>Due Date</TableHead><TableHead>Submissions</TableHead><TableHead>Status</TableHead></TableRow></TableHeader>
            <TableBody>
              {assignments.map((a: any) => (
                <TableRow key={a.id}>
                  <TableCell className="font-medium">{a.title}</TableCell>
                  <TableCell>{a.totalMarks}</TableCell>
                  <TableCell>{a.dueDate ? new Date(a.dueDate).toLocaleDateString() : "-"}</TableCell>
                  <TableCell><Badge variant="outline">{a._count?.submissions || 0}</Badge></TableCell>
                  <TableCell><Badge variant={new Date(a.dueDate) < new Date() ? "destructive" : "default"}>{new Date(a.dueDate) < new Date() ? "Overdue" : "Open"}</Badge></TableCell>
                </TableRow>
              ))}
              {assignments.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No assignments yet</TableCell></TableRow>}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
