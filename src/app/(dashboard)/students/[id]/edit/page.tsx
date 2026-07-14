"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { studentsApi, classesApi } from "@/lib/api"

export default function EditStudentPage() {
  const router = useRouter()
  const params = useParams()
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [classes, setClasses] = React.useState<any[]>([])
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
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
    status: "active",
  })

  React.useEffect(() => {
    classesApi.list().then((res) => {
      if (res.data) setClasses(res.data as any[])
    })
    if (params.id) {
      studentsApi.get(params.id as string).then((res) => {
        if (res.data) {
          const s = res.data as any
          setForm({
            firstName: s.user?.firstName || "",
            lastName: s.user?.lastName || "",
            phone: s.user?.phone || "",
            rollNumber: s.rollNumber || "",
            classId: s.classId || "",
            section: s.section || "",
            bloodGroup: s.bloodGroup || "",
            medicalConditions: s.medicalConditions || "",
            emergencyContactName: s.emergencyContactName || "",
            emergencyContactPhone: s.emergencyContactPhone || "",
            nationality: s.nationality || "",
            previousSchool: s.previousSchool || "",
            status: s.status || "active",
          })
        }
        setLoading(false)
      })
    }
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    const result = await studentsApi.update(params.id as string, form)
    setSaving(false)
    if (result.data) {
      router.push(`/students/${params.id}`)
    } else {
      alert(result.error || "Failed to update student")
    }
  }

  if (loading) return <div className="p-6">Loading...</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Edit Student</h1>
          <p className="text-muted-foreground">Update student information</p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input id="firstName" value={form.firstName} onChange={(e) => setForm({ ...form, firstName: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input id="lastName" value={form.lastName} onChange={(e) => setForm({ ...form, lastName: e.target.value })} />
              </div>
            </div>
            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nationality">Nationality</Label>
                <Input id="nationality" value={form.nationality} onChange={(e) => setForm({ ...form, nationality: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="bloodGroup">Blood Group</Label>
                <Input id="bloodGroup" value={form.bloodGroup} onChange={(e) => setForm({ ...form, bloodGroup: e.target.value })} />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="rollNumber">Roll Number</Label>
                <Input id="rollNumber" value={form.rollNumber} onChange={(e) => setForm({ ...form, rollNumber: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="graduated">Graduated</option>
                  <option value="transferred">Transferred</option>
                </select>
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
              <Label htmlFor="previousSchool">Previous School</Label>
              <Input id="previousSchool" value={form.previousSchool} onChange={(e) => setForm({ ...form, previousSchool: e.target.value })} />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Emergency Contact</CardTitle>
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
            <div>
              <Label htmlFor="medicalConditions">Medical Conditions</Label>
              <Input id="medicalConditions" value={form.medicalConditions} onChange={(e) => setForm({ ...form, medicalConditions: e.target.value })} />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Update Student"}
        </Button>
      </div>
    </div>
  )
}
