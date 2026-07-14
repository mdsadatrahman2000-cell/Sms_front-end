"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { teachersApi } from "@/lib/api"

export default function NewTeacherPage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    phone: "",
    employeeId: "",
    department: "",
    designation: "",
    joiningDate: "",
    qualification: "",
    experience: "",
    specialization: "",
  })

  const handleSave = async () => {
    setSaving(true)
    const result = await teachersApi.create(form)
    setSaving(false)
    if (result.data) {
      router.push("/teachers")
    } else {
      alert(result.error || "Failed to create teacher")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Teacher</h1>
          <p className="text-muted-foreground">Create a new teacher record</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Login credentials for the teacher</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="email">Email *</Label>
              <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="password">Password *</Label>
              <Input id="password" type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name *</Label>
                <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name *</Label>
                <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
            <CardDescription>Teacher employment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="employeeId">Employee ID *</Label>
                <Input id="employeeId" value={form.employeeId} onChange={(e) => setForm({ ...form, employeeId: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="joiningDate">Joining Date</Label>
                <Input id="joiningDate" type="date" value={form.joiningDate} onChange={(e) => setForm({ ...form, joiningDate: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Qualifications</CardTitle>
            <CardDescription>Academic and professional qualifications</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="qualification">Qualification</Label>
              <Input id="qualification" value={form.qualification} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="experience">Experience (years)</Label>
              <Input id="experience" type="number" value={form.experience} onChange={(e) => setForm({ ...form, experience: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="specialization">Specialization</Label>
              <Input id="specialization" value={form.specialization} onChange={(e) => setForm({ ...form, specialization: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.email || !form.password || !form.firstName || !form.lastName || !form.employeeId}>
          {saving ? "Saving..." : "Create Teacher"}
        </Button>
      </div>
    </div>
  )
}
