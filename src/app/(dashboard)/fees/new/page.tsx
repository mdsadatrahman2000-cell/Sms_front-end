"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { feesApi, studentsApi } from "@/lib/api"

export default function NewInvoicePage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [students, setStudents] = React.useState<any[]>([])
  const [feeStructures, setFeeStructures] = React.useState<any[]>([])
  const [form, setForm] = React.useState({
    studentId: "",
    feeStructureId: "",
    dueDate: "",
  })

  React.useEffect(() => {
    studentsApi.list().then((res) => {
      const d = res.data
      setStudents(Array.isArray(d) ? d : (d as any)?.students || [])
    })
    feesApi.structures().then((res) => {
      const d = res.data
      setFeeStructures(Array.isArray(d) ? d : (d as any)?.structures || [])
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const result = await feesApi.createInvoice({
      studentId: form.studentId,
      feeStructureId: form.feeStructureId,
      dueDate: form.dueDate,
    })
    setSaving(false)
    if (result.data) {
      router.push("/fees")
    } else {
      alert(result.error || "Failed to create invoice")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Create Invoice</h1>
          <p className="text-muted-foreground">Create a new fee invoice for a student</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Invoice Details</CardTitle>
          <CardDescription>Enter the details for the new invoice</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="studentId">Student *</Label>
              <Select value={form.studentId} onValueChange={(v) => setForm({ ...form, studentId: v })}>
                <SelectTrigger><SelectValue placeholder="Select student" /></SelectTrigger>
                <SelectContent>
                  {students.map((s: any) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.user?.firstName} {s.user?.lastName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="feeStructureId">Fee Structure *</Label>
              <Select value={form.feeStructureId} onValueChange={(v) => setForm({ ...form, feeStructureId: v })}>
                <SelectTrigger><SelectValue placeholder="Select fee structure" /></SelectTrigger>
                <SelectContent>
                  {feeStructures.map((fs: any) => (
                    <SelectItem key={fs.id} value={fs.id}>{fs.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="dueDate">Due Date *</Label>
              <Input
                id="dueDate"
                type="date"
                value={form.dueDate}
                onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.studentId || !form.feeStructureId || !form.dueDate}>
          {saving ? "Saving..." : "Create Invoice"}
        </Button>
      </div>
    </div>
  )
}
