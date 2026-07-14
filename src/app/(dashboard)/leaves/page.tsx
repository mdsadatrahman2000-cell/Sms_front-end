"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { leavesApi } from "@/lib/api"
import { Plus, Check, X } from "lucide-react"

export default function LeavesPage() {
  const [leaves, setLeaves] = React.useState<any[]>([])
  const [showForm, setShowForm] = React.useState(false)
  const [form, setForm] = React.useState({ startDate: "", endDate: "", reason: "", type: "personal" })

  const fetchLeaves = () => leavesApi.list().then(res => { if (res.data) setLeaves(res.data as any[]) })
  React.useEffect(() => { fetchLeaves() }, [])

  const handleApply = async () => {
    const result = await leavesApi.apply(form)
    if (result.data) { setShowForm(false); setForm({ startDate: "", endDate: "", reason: "", type: "personal" }); fetchLeaves() }
  }

  const handleApprove = async (id: string) => { await leavesApi.approve(id); fetchLeaves() }
  const handleReject = async (id: string) => { await leavesApi.reject(id); fetchLeaves() }

  const statusBadge = (status: string) => {
    switch (status) {
      case "approved": return <Badge className="bg-green-100 text-green-800">Approved</Badge>
      case "rejected": return <Badge variant="destructive">Rejected</Badge>
      default: return <Badge variant="outline">Pending</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div><h1 className="text-3xl font-bold tracking-tight">Leave Management</h1><p className="text-muted-foreground">Apply for and manage leave requests</p></div>
        <Button onClick={() => setShowForm(!showForm)}><Plus className="h-4 w-4 mr-1" /> Apply Leave</Button>
      </div>

      {showForm && (
        <Card><CardHeader><CardTitle>Apply for Leave</CardTitle></CardHeader><CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2"><Label>Start Date</Label><Input type="date" value={form.startDate} onChange={e => setForm({ ...form, startDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>End Date</Label><Input type="date" value={form.endDate} onChange={e => setForm({ ...form, endDate: e.target.value })} /></div>
            <div className="space-y-2"><Label>Type</Label><Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}><SelectTrigger><SelectValue /></SelectTrigger><SelectContent><SelectItem value="sick">Sick</SelectItem><SelectItem value="personal">Personal</SelectItem><SelectItem value="casual">Casual</SelectItem><SelectItem value="other">Other</SelectItem></SelectContent></Select></div>
          </div>
          <div className="space-y-2"><Label>Reason</Label><Input value={form.reason} onChange={e => setForm({ ...form, reason: e.target.value })} /></div>
          <div className="flex gap-2"><Button onClick={handleApply}>Submit</Button><Button variant="outline" onClick={() => setShowForm(false)}>Cancel</Button></div>
        </CardContent></Card>
      )}

      <Card><CardContent className="p-0 pt-4">
        <Table><TableHeader><TableRow><TableHead>Employee</TableHead><TableHead>Type</TableHead><TableHead>Dates</TableHead><TableHead>Reason</TableHead><TableHead>Status</TableHead><TableHead>Actions</TableHead></TableRow></TableHeader>
          <TableBody>{leaves.map((l: any) => <TableRow key={l.id}><TableCell className="font-medium">{l.user?.firstName} {l.user?.lastName}</TableCell><TableCell className="capitalize">{l.type}</TableCell><TableCell>{new Date(l.startDate).toLocaleDateString()} - {new Date(l.endDate).toLocaleDateString()}</TableCell><TableCell className="max-w-xs truncate">{l.reason}</TableCell><TableCell>{statusBadge(l.status)}</TableCell><TableCell>{l.status === "pending" && <div className="flex gap-1"><Button size="sm" variant="ghost" onClick={() => handleApprove(l.id)}><Check className="h-4 w-4 text-green-500" /></Button><Button size="sm" variant="ghost" onClick={() => handleReject(l.id)}><X className="h-4 w-4 text-red-500" /></Button></div>}</TableCell></TableRow>)}
          {leaves.length === 0 && <TableRow><TableCell colSpan={6} className="text-center py-8 text-muted-foreground">No leave requests</TableCell></TableRow>}
        </TableBody></Table>
      </CardContent></Card>
    </div>
  )
}
