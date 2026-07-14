"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { scholarshipsApi, studentsApi } from "@/lib/api"
import { Plus, Trash2 } from "lucide-react"

export default function ScholarshipsPage() {
  const [scholarships, setScholarships] = React.useState<any[]>([])
  const [students, setStudents] = React.useState<any[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [applyForm, setApplyForm] = React.useState<{ scholarshipId: string; studentId: string }>({ scholarshipId: "", studentId: "" })
  const [form, setForm] = React.useState({ name: "", description: "", amount: "0", type: "fixed" })

  const fetchScholarships = () => scholarshipsApi.list().then(res => { if (res.data) setScholarships(res.data as any[]) })
  React.useEffect(() => { fetchScholarships(); studentsApi.list().then(res => { if (res.data) setStudents(Array.isArray(res.data) ? res.data : []) }) }, [])

  const handleCreate = async () => {
    const result = await scholarshipsApi.create({ ...form, amount: Number(form.amount) })
    if (result.data) { setShowForm(false); setForm({ name: "", description: "", amount: "0", type: "fixed" }); fetchScholarships() }
  }

  const handleApply = async () => {
    if (!applyForm.scholarshipId || !applyForm.studentId) return
    await scholarshipsApi.apply(applyForm.scholarshipId, { studentId: applyForm.studentId })
    setApplyForm({ scholarshipId: "", studentId: "" })
    fetchScholarships()
  }

  const handleUnapply = async (scholarshipId: string, studentId: string) => {
    await scholarshipsApi.unapply(scholarshipId, studentId)
    fetchScholarships()
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Scholarships</h1><p className="text-muted-foreground">Manage scholarships and student awards</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> New Scholarship</Button>
      </div>

      {showForm && (
        <Card><CardHeader><CardTitle>Create Scholarship</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2"><Label>Name</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} /></div>
            <div className="space-y-2"><Label>Amount</Label><Input type="number" value={form.amount} onChange={e => setForm({ ...form, amount: e.target.value })} /></div>
            <div className="space-y-2"><Label>Type</Label><Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="fixed">Fixed Amount</SelectItem><SelectItem value="percentage">Percentage</SelectItem></SelectContent></Select></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
          </div>
          <div className="flex gap-2"><Button onClick={handleCreate}>Create</Button><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </CardContent></Card>
      )}

      <Card><CardHeader><CardTitle>Apply Scholarship to Student</CardTitle></CardHeader><CardContent>
        <div className="flex gap-4 items-end">
          <div className="flex-1 space-y-2"><Label>Scholarship</Label><Select value={applyForm.scholarshipId} onValueChange={v => setApplyForm({ ...applyForm, scholarshipId: v })}><SelectTrigger><SelectValue placeholder="Select scholarship" /></SelectTrigger><SelectContent>{scholarships.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
          <div className="flex-1 space-y-2"><Label>Student</Label><Select value={applyForm.studentId} onValueChange={v => setApplyForm({ ...applyForm, studentId: v })}><SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger><SelectContent>{students.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.user?.firstName} {s.user?.lastName}</SelectItem>)}</SelectContent></Select></div>
          <Button onClick={handleApply}>Apply</Button>
        </div>
      </CardContent></Card>

      <Card><CardContent className="p-0 pt-4">
        <Table><TableHeader><TableRow><TableHead>Name</TableHead><TableHead>Amount</TableHead><TableHead>Type</TableHead><TableHead>Recipients</TableHead><TableHead>Awarded To</TableHead></TableRow></TableHeader>
          <TableBody>{scholarships.map((s: any) => <TableRow key={s.id}><TableCell className="font-medium">{s.name}</TableCell><TableCell>${s.amount}</TableCell><TableCell className="capitalize">{s.type}</TableCell><TableCell>{s.recipients?.length || 0}{s.maxRecipients ? `/${s.maxRecipients}` : ""}</TableCell><TableCell>{s.recipients?.map((r: any) => <div key={r.id} className="flex items-center gap-1 text-xs"><span>{r.student?.user?.firstName} {r.student?.user?.lastName}</span><Button size="sm" variant="ghost" className="h-4 w-4 p-0" onClick={() => handleUnapply(s.id, r.studentId)}><Trash2 className="h-3 w-3" /></Button></div>) || "-"}</TableCell></TableRow>)}
          {scholarships.length === 0 && <TableRow><TableCell colSpan={5} className="text-center py-8 text-muted-foreground">No scholarships yet</TableCell></TableRow>}
        </TableBody></Table>
      </CardContent></Card>
    </div>
  )
}
