"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { attendancesApi, classesApi } from "@/lib/api"

export default function NewAttendancePage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [classes, setClasses] = React.useState<any[]>([])
  const [students, setStudents] = React.useState<any[]>([])
  const [classId, setClassId] = React.useState("")
  const [date, setDate] = React.useState(new Date().toISOString().split("T")[0])
  const [records, setRecords] = React.useState<Record<string, string>>({})

  React.useEffect(() => {
    classesApi.list().then((res) => {
      const d = res.data
      setClasses(Array.isArray(d) ? d : (d as any)?.classes || [])
    })
  }, [])

  React.useEffect(() => {
    if (!classId) {
      setStudents([])
      setRecords({})
      return
    }
    attendancesApi.getByClass(classId, date).then((res) => {
      const d = res.data
      const existing = (Array.isArray(d) ? d : []) as any[]
      setStudents(existing.map((r: any) => r.student).filter(Boolean))
      const initial: Record<string, string> = {}
      existing.forEach((r: any) => {
        initial[r.student?.id || r.studentId] = r.status
      })
      setRecords(initial)
    })
  }, [classId, date])

  const handleStatusChange = (studentId: string, status: string) => {
    setRecords({ ...records, [studentId]: status })
  }

  const handleSubmit = async () => {
    setSaving(true)
    const payload = {
      classId,
      date,
      records: Object.entries(records).map(([studentId, status]) => ({
        studentId,
        status,
      })),
    }
    const result = await attendancesApi.bulkCreate(payload)
    setSaving(false)
    if (result.data) {
      router.push("/attendances")
    } else {
      alert(result.error || "Failed to submit attendance")
    }
  }

  const statusBadge = (status: string) => {
    switch (status) {
      case "present": return <Badge className="bg-green-100 text-green-800">Present</Badge>
      case "absent": return <Badge variant="destructive">Absent</Badge>
      case "late": return <Badge className="bg-yellow-100 text-yellow-800">Late</Badge>
      case "excused": return <Badge className="bg-blue-100 text-blue-800">Excused</Badge>
      default: return <Badge variant="secondary">{status || "Not set"}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mark Attendance</h1>
          <p className="text-muted-foreground">Record attendance for students in a class</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class & Date</CardTitle>
          <CardDescription>Select the class and date to mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Class *</Label>
              <Select value={classId} onValueChange={setClassId}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Date *</Label>
              <Input type="date" value={date} onChange={(e) => setDate(e.target.value)} />
            </div>
          </div>
        </CardContent>
      </Card>

      {students.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>{students.length} students in this class</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {students.map((s: any) => (
                  <TableRow key={s.id}>
                    <TableCell>{s.user?.firstName} {s.user?.lastName}</TableCell>
                    <TableCell>
                      <Select
                        value={records[s.id] || ""}
                        onValueChange={(v) => handleStatusChange(s.id, v)}
                      >
                        <SelectTrigger className="w-[180px]">
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="present">Present</SelectItem>
                          <SelectItem value="absent">Absent</SelectItem>
                          <SelectItem value="late">Late</SelectItem>
                          <SelectItem value="excused">Excused</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {classId && students.length === 0 && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No students found for this class on this date.
          </CardContent>
        </Card>
      )}

      {students.length > 0 && (
        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
          <Button onClick={handleSubmit} disabled={saving}>
            {saving ? "Saving..." : "Submit Attendance"}
          </Button>
        </div>
      )}
    </div>
  )
}
