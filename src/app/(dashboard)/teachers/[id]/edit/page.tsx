"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { teachersApi } from "@/lib/api"

export default function EditTeacherPage() {
  const router = useRouter()
  const params = useParams()
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [form, setForm] = React.useState({
    firstName: "",
    lastName: "",
    phone: "",
    department: "",
    designation: "",
    qualification: "",
    experience: "",
    specialization: "",
    status: "active",
  })

  React.useEffect(() => {
    if (params.id) {
      teachersApi.get(params.id as string).then((res) => {
        if (res.data) {
          const t = res.data as any
          setForm({
            firstName: t.user?.firstName || "",
            lastName: t.user?.lastName || "",
            phone: t.user?.phone || "",
            department: t.department || "",
            designation: t.designation || "",
            qualification: t.qualification || "",
            experience: t.experience != null ? String(t.experience) : "",
            specialization: t.specialization || "",
            status: t.status || "active",
          })
        }
        setLoading(false)
      })
    }
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    const result = await teachersApi.update(params.id as string, form)
    setSaving(false)
    if (result.data) {
      router.push(`/teachers/${params.id}`)
    } else {
      alert(result.error || "Failed to update teacher")
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Teacher</h1>
          <p className="text-muted-foreground">Update teacher information</p>
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
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Employment Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="department">Department</Label>
                <Input id="department" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
              </div>
              <div>
                <Label htmlFor="designation">Designation</Label>
                <Input id="designation" value={form.designation} onChange={(e) => setForm({ ...form, designation: e.target.value })} />
              </div>
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
                <option value="on_leave">On Leave</option>
                <option value="terminated">Terminated</option>
              </select>
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
        <Button onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Update Teacher"}
        </Button>
      </div>
    </div>
  )
}
