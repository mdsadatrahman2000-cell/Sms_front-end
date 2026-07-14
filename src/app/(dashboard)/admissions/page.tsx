"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { admissionsApi } from "@/lib/api"
import { Plus, ArrowRight } from "lucide-react"

const STATUSES = ["applied", "reviewed", "enrolled", "rejected"] as const
const STATUS_COLORS: Record<string, string> = { applied: "bg-blue-100 text-blue-800", reviewed: "bg-yellow-100 text-yellow-800", enrolled: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" }

export default function AdmissionsPage() {
  const [applications, setApplications] = React.useState<any[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState({ studentName: "", parentName: "", email: "", phone: "", dateOfBirth: "", gradeApplying: "", previousSchool: "", notes: "" })

  const fetchApps = () => admissionsApi.list().then(res => { if (res.data) setApplications(res.data as any[]) })
  React.useEffect(() => { fetchApps() }, [])

  const handleCreate = async () => {
    const result = await admissionsApi.create(form)
    if (result.data) { setShowForm(false); setForm({ studentName: "", parentName: "", email: "", phone: "", dateOfBirth: "", gradeApplying: "", previousSchool: "", notes: "" }); fetchApps() }
  }

  const handleStatusChange = async (id: string, newStatus: string) => {
    await admissionsApi.updateStatus(id, newStatus)
    fetchApps()
  }

  const nextStatus: Record<string, string> = { applied: "reviewed", reviewed: "enrolled" }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Admissions</h1><p className="text-muted-foreground">Manage admission applications pipeline</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> New Application</Button>
      </div>

      {showForm && (
        <Card><CardHeader><CardTitle>New Admission Application</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Student Name</Label><Input value={form.studentName} onChange={e => setForm({ ...form, studentName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Parent Name</Label><Input value={form.parentName} onChange={e => setForm({ ...form, parentName: e.target.value })} /></div>
            <div className="space-y-2"><Label>Email</Label><Input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} /></div>
            <div className="space-y-2"><Label>Phone</Label><Input value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} /></div>
            <div className="space-y-2"><Label>Date of Birth</Label><Input type="date" value={form.dateOfBirth} onChange={e => setForm({ ...form, dateOfBirth: e.target.value })} /></div>
            <div className="space-y-2"><Label>Grade Applying For</Label><Input value={form.gradeApplying} onChange={e => setForm({ ...form, gradeApplying: e.target.value })} /></div>
          </div>
          <div className="space-y-2"><Label>Previous School</Label><Input value={form.previousSchool} onChange={e => setForm({ ...form, previousSchool: e.target.value })} /></div>
          <div className="space-y-2"><Label>Notes</Label><Input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} /></div>
          <div className="flex gap-2"><Button onClick={handleCreate}>Submit Application</Button><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </CardContent></Card>
      )}

      <div className="grid grid-cols-4 gap-4">
        {STATUSES.map(status => {
          const items = applications.filter(a => a.status === status)
          return (
            <div key={status} className="space-y-3">
              <div className="flex items-center justify-between"><h3 className="font-semibold capitalize">{status}</h3><Badge variant="outline">{items.length}</Badge></div>
              {items.map(app => (
                <Card key={app.id} className="p-3">
                  <p className="font-medium text-sm">{app.studentName}</p>
                  <p className="text-xs text-muted-foreground">{app.gradeApplying} | {app.parentName}</p>
                  <p className="text-xs text-muted-foreground">{app.email}</p>
                  <div className="mt-2 flex gap-1">
                    {nextStatus[status] && <Button size="sm" variant="outline" className="text-xs h-7" onClick={() => handleStatusChange(app.id, nextStatus[status])}>{nextStatus[status]} <ArrowRight className="h-3 w-3 ml-1" /></Button>}
                    {status !== "rejected" && status !== "enrolled" && <Button size="sm" variant="ghost" className="text-xs h-7 text-destructive" onClick={() => handleStatusChange(app.id, "rejected")}>Reject</Button>}
                  </div>
                </Card>
              ))}
            </div>
          )
        })}
      </div>
    </div>
  )
}
