"use client"

import * as React from "react"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { attendancesApi, classesApi } from "@/lib/api"
import { AttendanceBarChart, AttendancePieChart } from "@/components/charts/attendance-chart"
import { TrendingUp, Users, CheckCircle, XCircle } from "lucide-react"

export default function AttendanceAnalyticsPage() {
  const [classes, setClasses] = React.useState<any[]>([])
  const [selectedClass, setSelectedClass] = React.useState("")
  const [records, setRecords] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(false)

  React.useEffect(() => { classesApi.list().then(res => { if (res.data) setClasses(Array.isArray(res.data) ? res.data : []) }) }, [])

  React.useEffect(() => {
    if (selectedClass) {
      setLoading(true)
      const today = new Date().toISOString().split("T")[0]
      attendancesApi.getByClass(selectedClass, today).then(res => {
        if (res.data) setRecords(res.data as any[])
        setLoading(false)
      })
    }
  }, [selectedClass])

  const present = records.filter(r => r.status === "present").length
  const absent = records.filter(r => r.status === "absent").length
  const late = records.filter(r => r.status === "late").length
  const total = records.length
  const rate = total > 0 ? Math.round((present / total) * 100) : 0

  const barData = [{ label: "Today", present, absent }]
  const pieData = [{ name: "Present", value: present }, { name: "Absent", value: absent }, { name: "Late", value: late }].filter(d => d.value > 0)

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/attendances"><ArrowLeft className="h-4 w-4" /></Link>
        <div><h1 className="text-3xl font-bold tracking-tight">Attendance Analytics</h1><p className="text-muted-foreground">Visualize attendance data and trends</p></div>
      </div>

      <div className="max-w-xs">
        <Select value={selectedClass} onValueChange={setSelectedClass}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Total Students</CardTitle><Users className="h-4 w-4 text-blue-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{total}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Present</CardTitle><CheckCircle className="h-4 w-4 text-green-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-green-600">{present}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Absent</CardTitle><XCircle className="h-4 w-4 text-red-500" /></CardHeader><CardContent><div className="text-2xl font-bold text-red-600">{absent}</div></CardContent></Card>
        <Card><CardHeader className="flex flex-row items-center justify-between pb-2"><CardTitle className="text-sm font-medium">Attendance Rate</CardTitle><TrendingUp className="h-4 w-4 text-emerald-500" /></CardHeader><CardContent><div className="text-2xl font-bold">{rate}%</div></CardContent></Card>
      </div>

      {selectedClass && !loading && (
        <div className="grid gap-4 md:grid-cols-2">
          <Card><CardHeader><CardTitle>Attendance Overview</CardTitle></CardHeader><CardContent><AttendanceBarChart data={barData} /></CardContent></Card>
          <Card><CardHeader><CardTitle>Distribution</CardTitle></CardHeader><CardContent><AttendancePieChart data={pieData} /></CardContent></Card>
        </div>
      )}

      {!selectedClass && <Card><CardContent className="py-8 text-center text-muted-foreground">Select a class to view analytics</CardContent></Card>}
    </div>
  )
}
