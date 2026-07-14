"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { studentsApi, classesApi } from "@/lib/api"

export default function NewStudentPage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [classes, setClasses] = React.useState<any[]>([])
  const [form, setForm] = React.useState({
    email: "",
    password: "",
    firstName: "",
    lastName: "",
    admissionNumber: "",
    phone: "",
    rollNumber: "",
    classId: "",
    section: "",
    bloodGroup: "",
    medicalConditions: "",
    emergencyContactName: "",
    emergencyContactPhone: "",
    nationality: "",
    previousSchool: "",
    admissionDate: "",
  })

  React.useEffect(() => {
    classesApi.list().then((res) => {
      if (res.data) setClasses(res.data as any[])
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const result = await studentsApi.create(form)
    setSaving(false)
    if (result.data) {
      router.push("/students")
    } else {
      alert(result.error || "Failed to create student")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Student</h1>
          <p className="text-muted-foreground">Create a new student record</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Account Information</CardTitle>
            <CardDescription>Login credentials for the student</CardDescription>
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
            <CardTitle>Academic Information</CardTitle>
            <CardDescription>Student enrollment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="admissionNumber">Admission Number *</Label>
                <Input id="admissionNumber" value={form.admissionNumber} onChange={(e) => setForm({ ...form, admissionNumber: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="classId">Class</Label>
                <select
                  id="classId"
                  value={form.classId}
                  onChange={(e) => setForm({ ...form, classId: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="">Select class</option>
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name} - {c.section}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <Label htmlFor="section">Section</Label>
                <Input id="section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="admissionDate">Admission Date</Label>
              <Input id="admissionDate" type="date" value={form.admissionDate} onChange={(e) => setForm({ ...form, admissionDate: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="previousSchool">Previous School</Label>
              <Input id="previousSchool" value={form.previousSchool} onChange={(e) => setForm({ ...form, previousSchool: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
            <CardDescription>Additional student details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input id="bloodGroup" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <Input id="medicalConditions" value={form.medicalConditions} onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
            <CardDescription>Emergency contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="emergencyContactName">Contact Name</Label>
              <Input id="emergencyContactName" value={form.emergencyContactName} onChange={(e) => setForm({ ...form, emergencyContactName: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="emergencyContactPhone">Contact Phone</Label>
              <Input id="emergencyContactPhone" value={form.emergencyContactPhone} onChange={(e) => setForm({ ...form, emergencyContactPhone: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.email || !form.password || !form.firstName || !form.lastName || !form.admissionNumber}>
          {saving ? "Saving..." : "Create Student"}
        </Button>
      </div>
    </div>
  )
}
