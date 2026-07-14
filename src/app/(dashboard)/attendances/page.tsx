"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { attendancesApi, classesApi } from "@/lib/api"
import { Check, X, Clock, Search } from "lucide-react"

export default function AttendancesPage() {
  const [records, setRecords] = React.useState<any[]>([])
  const [classes, setClasses] = React.useState<any[]>([])
  const [selectedClass, setSelectedClass] = React.useState("")
  const [selectedDate, setSelectedDate] = React.useState(new Date().toISOString().split("T")[0])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => {
    classesApi.list().then((res) => {
      if (res.data) setClasses(Array.isArray(res.data) ? res.data : (res.data as any).classes || [])
    })
  }, [])

  const loadAttendance = async () => {
    if (!selectedClass) return
    setLoading(true)
    const res = await attendancesApi.getByClass(selectedClass, selectedDate)
    if (res.data) setRecords(res.data as any[])
    setLoading(false)
  }

  React.useEffect(() => {
    if (selectedClass) loadAttendance()
  }, [selectedClass, selectedDate])

  const statusIcon = (status: string) => {
    switch (status) {
      case "present": return <Check className="h-4 w-4 text-green-500" />
      case "absent": return <X className="h-4 w-4 text-red-500" />
      case "late": return <Clock className="h-4 w-4 text-yellow-500" />
      default: return <span className="text-xs text-muted-foreground">-</span>
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Attendance</h1>
        <p className="text-muted-foreground">Track and manage student attendance</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Mark Attendance</CardTitle>
          <CardDescription>Select class and date to view or mark attendance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-4 items-end">
            <div className="flex-1">
              <Label>Class</Label>
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger>
                <SelectContent>
                  {classes.map((c: any) => (
                    <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex-1">
              <Label>Date</Label>
              <Input type="date" value={selectedDate} onChange={(e) => setSelectedDate(e.target.value)} />
            </div>
            <Button onClick={loadAttendance}><Search className="h-4 w-4 mr-2" /> Load</Button>
          </div>
        </CardContent>
      </Card>

      {records.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attendance Records</CardTitle>
            <CardDescription>{records.length} students</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Notes</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {records.map((r: any) => (
                  <TableRow key={r.id}>
                    <TableCell>{r.student?.user?.firstName} {r.student?.user?.lastName}</TableCell>
                    <TableCell>
                      <Badge variant={r.status === "present" ? "default" : r.status === "absent" ? "destructive" : "secondary"}>
                        <span className="flex items-center gap-1">{statusIcon(r.status)} {r.status}</span>
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground">{r.notes || "-"}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {records.length === 0 && selectedClass && !loading && (
        <Card>
          <CardContent className="py-8 text-center text-muted-foreground">
            No attendance records found for this date. Students may need to be enrolled in this class.
          </CardContent>
        </Card>
      )}
    </div>
  )
}
