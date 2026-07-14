"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subjectsApi } from "@/lib/api"

export default function EditSubjectPage() {
  const router = useRouter()
  const params = useParams()
  const [saving, setSaving] = React.useState(false)
  const [loading, setLoading] = React.useState(true)
  const [form, setForm] = React.useState({
    name: "",
    code: "",
    description: "",
    isElective: false,
  })

  React.useEffect(() => {
    if (params.id) {
      subjectsApi.get(params.id as string).then((res) => {
        if (res.data) {
          const s = res.data as any
          setForm({
            name: s.name || "",
            code: s.code || "",
            description: s.description || "",
            isElective: s.isElective || false,
          })
        }
        setLoading(false)
      })
    }
  }, [params.id])

  const handleSave = async () => {
    setSaving(true)
    const result = await subjectsApi.update(params.id as string, form)
    setSaving(false)
    if (result.data) {
      router.push(`/subjects/${params.id}`)
    } else {
      alert(result.error || "Failed to update subject")
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
          <h1 className="text-3xl font-bold tracking-tight">Edit Subject</h1>
          <p className="text-muted-foreground">Update subject information</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Information</CardTitle>
          <CardDescription>Update the details for this subject</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="code">Code</Label>
              <Input
                id="code"
                value={form.code}
                onChange={(e) => setForm({ ...form, code: e.target.value })}
              />
            </div>
          </div>
          <div>
            <Label htmlFor="description">Description</Label>
            <Input
              id="description"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="isElective"
              checked={form.isElective}
              onChange={(e) => setForm({ ...form, isElective: e.target.checked })}
              className="h-4 w-4 rounded border-input"
            />
            <Label htmlFor="isElective">Elective Subject</Label>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={() => router.back()}>Cancel</Button>
        <Button onClick={handleSave} disabled={saving || !form.name}>
          {saving ? "Saving..." : "Update Subject"}
        </Button>
      </div>
    </div>
  )
}
