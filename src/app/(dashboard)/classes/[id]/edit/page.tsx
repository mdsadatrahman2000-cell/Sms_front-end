"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { classesApi, teachersApi } from "@/lib/api"

export default function EditClassPage() {
  const router = useRouter()
  const params = useParams()
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [teachers, setTeachers] = React.useState<any[]>([])
  const [form, setForm] = React.useState({
    name: "",
    gradeLevel: "",
    section: "",
    maxCapacity: "",
    classTeacherId: "",
  })

  React.useEffect(() => {
    teachersApi.list().then((res) => {
      if (res.data) setTeachers((res.data as any).teachers || [])
    })
    if (params.id) {
      classesApi.get(params.id as string).then((res) => {
        if (res.data) {
          const c = res.data as any
          setForm({
            name: c.name || "",
            gradeLevel: c.gradeLevel?.toString() || "",
            section: c.section || "",
            maxCapacity: c.maxCapacity?.toString() || "",
            classTeacherId: c.classTeacherId || c.classTeacher?.id || "",
          })
        }
        setLoading(false)
      })
    }
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    const payload: any = { name: form.name }
    if (form.gradeLevel) payload.gradeLevel = Number(form.gradeLevel)
    if (form.section) payload.section = form.section
    if (form.maxCapacity) payload.maxCapacity = Number(form.maxCapacity)
    if (form.classTeacherId) payload.classTeacherId = form.classTeacherId
    const result = await classesApi.update(params.id as string, payload)
    setSaving(false)
    if (result.data) {
      router.push(`/classes/${params.id}`)
    } else {
      alert(result.error || "Failed to update class")
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Class</h1>
          <p className="text-muted-foreground">Update class information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
          <CardDescription>Update the class details</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="gradeLevel">Grade Level</Label>
              <Input id="gradeLevel" type="number" value={form.gradeLevel} onChange={(e) => setForm({ ...form, gradeLevel: e.target.value })} />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="section">Section</Label>
              <Input id="section" value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} />
            </div>
            <div>
              <Label htmlFor="maxCapacity">Max Capacity</Label>
              <Input id="maxCapacity" type="number" value={form.maxCapacity} onChange={(e) => setForm({ ...form, maxCapacity: e.target.value })} />
            </div>
          </div>
          <div>
            <Label htmlFor="classTeacherId">Class Teacher</Label>
            <select
              id="classTeacherId"
              value={form.classTeacherId}
              onChange={(e) => setForm({ ...form, classTeacherId: e.target.value })}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            >
              <option value="">Select teacher (optional)</option>
              {teachers.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.user?.firstName} {t.user?.lastName}
                </option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.name}>
          {saving ? "Saving..." : "Update Class"}
        </Button>
      </div>
    </div>
  )
}
