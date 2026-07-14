"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { classesApi, academicYearsApi, teachersApi } from "@/lib/api"

export default function NewClassPage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [academicYears, setAcademicYears] = React.useState<any[]>([])
  const [teachers, setTeachers] = React.useState<any[]>([])
  const [form, setForm] = React.useState({
    name: "",
    gradeLevel: "",
    section: "",
    maxCapacity: "",
    academicYearId: "",
    classTeacherId: "",
  })

  React.useEffect(() => {
    academicYearsApi.list().then((res) => {
      if (res.data) setAcademicYears(res.data as any[])
    })
    teachersApi.list().then((res) => {
      if (res.data) setTeachers((res.data as any).teachers || [])
    })
  }, [])

  const handleSave = async () => {
    setSaving(true)
    const payload: any = {
      name: form.name,
      academicYearId: form.academicYearId,
    }
    if (form.gradeLevel) payload.gradeLevel = Number(form.gradeLevel)
    if (form.section) payload.section = form.section
    if (form.maxCapacity) payload.maxCapacity = Number(form.maxCapacity)
    if (form.classTeacherId) payload.classTeacherId = form.classTeacherId
    const result = await classesApi.create(payload)
    setSaving(false)
    if (result.data) {
      router.push("/classes")
    } else {
      alert(result.error || "Failed to create class")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Class</h1>
          <p className="text-muted-foreground">Create a new class</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Information</CardTitle>
          <CardDescription>Enter the details for the new class</CardDescription>
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
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="academicYearId">Academic Year *</Label>
              <select
                id="academicYearId"
                value={form.academicYearId}
                onChange={(e) => setForm({ ...form, academicYearId: e.target.value })}
                className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              >
                <option value="">Select academic year</option>
                {academicYears.map((ay) => (
                  <option key={ay.id} value={ay.id}>
                    {ay.name}
                  </option>
                ))}
              </select>
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
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.name || !form.academicYearId}>
          {saving ? "Saving..." : "Create Class"}
        </Button>
      </div>
    </div>
  )
}
