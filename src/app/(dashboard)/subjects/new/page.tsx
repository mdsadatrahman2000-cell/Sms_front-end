"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { subjectsApi } from "@/lib/api"

export default function NewSubjectPage() {
  const router = useRouter()
  const [saving, setSaving] = React.useState(false)
  const [form, setForm] = React.useState({
    name: "",
    code: "",
    description: "",
    isElective: false,
  })

  const handleSave = async () => {
    setSaving(true)
    const result = await subjectsApi.create(form)
    setSaving(false)
    if (result.data) {
      router.push("/subjects")
    } else {
      alert(result.error || "Failed to create subject")
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Add Subject</h1>
          <p className="text-muted-foreground">Create a new subject</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject Information</CardTitle>
          <CardDescription>Enter the details for the new subject</CardDescription>
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
          {saving ? "Saving..." : "Create Subject"}
        </Button>
      </div>
    </div>
  )
}
