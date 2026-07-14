"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { lmsApi, teachersApi, classesApi, subjectsApi } from "@/lib/api"

export default function NewCoursePage() {
  const router = useRouter()
  const [loading, setLoading] = React.useState(false)
  const [teachers, setTeachers] = React.useState<any[]>([])
  const [classes, setClasses] = React.useState<any[]>([])
  const [subjects, setSubjects] = React.useState<any[]>([])
  const [form, setForm] = React.useState({ title: "", description: "", teacherId: "", classId: "", subjectId: "" })

  React.useEffect(() => {
    Promise.all([teachersApi.list(), classesApi.list(), subjectsApi.list()]).then(([t, c, s]) => {
      if (t.data) setTeachers(Array.isArray(t.data) ? t.data : (t.data as any).teachers || [])
      if (c.data) setClasses(Array.isArray(c.data) ? c.data : (c.data as any).classes || [])
      if (s.data) setSubjects(Array.isArray(s.data) ? s.data : (s.data as any).subjects || [])
    })
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    const result = await lmsApi.createCourse(form)
    setLoading(false)
    if (result.data) router.push("/lms")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/lms"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div><h1 className="text-3xl font-bold tracking-tight">Create Course</h1><p className="text-muted-foreground">Add a new course to the LMS</p></div>
      </div>
      <Card>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-4 max-w-xl">
            <div className="space-y-2"><Label>Title</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} required /></div>
            <div className="space-y-2"><Label>Description</Label><Input value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} /></div>
            <div className="space-y-2"><Label>Teacher</Label><Select value={form.teacherId} onValueChange={v => setForm({ ...form, teacherId: v })}><SelectTrigger><SelectValue placeholder="Select teacher" /></SelectTrigger><SelectContent>{teachers.map((t: any) => <SelectItem key={t.id} value={t.id}>{t.firstName} {t.lastName}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Class</Label><Select value={form.classId} onValueChange={v => setForm({ ...form, classId: v })}><SelectTrigger><SelectValue placeholder="Select class" /></SelectTrigger><SelectContent>{classes.map((c: any) => <SelectItem key={c.id} value={c.id}>{c.name} {c.section}</SelectItem>)}</SelectContent></Select></div>
            <div className="space-y-2"><Label>Subject</Label><Select value={form.subjectId} onValueChange={v => setForm({ ...form, subjectId: v })}><SelectTrigger><SelectValue placeholder="Select subject" /></SelectTrigger><SelectContent>{subjects.map((s: any) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}</SelectContent></Select></div>
            <div className="flex gap-2"><Button type="submit" disabled={loading}>{loading ? "Creating..." : "Create Course"}</Button><Link href="/lms"><Button variant="outline" type="button">Cancel</Button></Link></div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
