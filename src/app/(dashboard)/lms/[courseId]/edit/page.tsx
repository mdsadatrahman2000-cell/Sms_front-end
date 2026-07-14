"use client"

import * as React from "react"
import { useParams, useRouter } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, Plus, Trash2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { lmsApi } from "@/lib/api"

export default function EditCoursePage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const [course, setCourse] = React.useState<any>(null)
  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [newModuleTitle, setNewModuleTitle] = React.useState("")
  const [newLessonTitles, setNewLessonTitles] = React.useState<Record<string, string>>({})
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    lmsApi.getCourse(courseId).then(res => {
      if (res.data) { setCourse(res.data); setTitle(res.data.title); setDescription(res.data.description || "") }
      setLoading(false)
    })
  }, [courseId])

  const handleUpdateCourse = async () => {
    await lmsApi.updateCourse(courseId, { title, description })
    const res = await lmsApi.getCourse(courseId)
    if (res.data) setCourse(res.data)
  }

  const handleAddModule = async () => {
    if (!newModuleTitle) return
    await lmsApi.addModule(courseId, { title: newModuleTitle, orderIndex: course?.modules?.length || 0 })
    setNewModuleTitle("")
    const res = await lmsApi.getCourse(courseId)
    if (res.data) setCourse(res.data)
  }

  const handleDeleteModule = async (moduleId: string) => {
    if (!window.confirm("Delete this module and all its lessons?")) return
    await lmsApi.deleteModule(moduleId)
    const res = await lmsApi.getCourse(courseId)
    if (res.data) setCourse(res.data)
  }

  const handleAddLesson = async (moduleId: string) => {
    const title = newLessonTitles[moduleId]
    if (!title) return
    await lmsApi.addLesson(moduleId, { title, contentType: "text", orderIndex: 0 })
    setNewLessonTitles({ ...newLessonTitles, [moduleId]: "" })
    const res = await lmsApi.getCourse(courseId)
    if (res.data) setCourse(res.data)
  }

  const handleDeleteLesson = async (lessonId: string) => {
    await lmsApi.deleteLesson(lessonId)
    const res = await lmsApi.getCourse(courseId)
    if (res.data) setCourse(res.data)
  }

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/lms/${courseId}`}><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <h1 className="text-3xl font-bold tracking-tight">Edit Course</h1>
      </div>

      <Card>
        <CardHeader><CardTitle>Course Details</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2"><Label>Title</Label><Input value={title} onChange={e => setTitle(e.target.value)} /></div>
          <div className="space-y-2"><Label>Description</Label><Input value={description} onChange={e => setDescription(e.target.value)} /></div>
          <Button onClick={handleUpdateCourse}>Save Changes</Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><CardTitle>Modules</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {course?.modules?.map((mod: any) => (
            <Card key={mod.id} className="bg-muted/30">
              <CardHeader className="pb-2 flex flex-row items-center justify-between">
                <CardTitle className="text-base">{mod.title}</CardTitle>
                <Button size="sm" variant="ghost" onClick={() => handleDeleteModule(mod.id)}><Trash2 className="h-4 w-4 text-destructive" /></Button>
              </CardHeader>
              <CardContent className="space-y-2">
                {mod.lessons?.map((lesson: any) => (
                  <div key={lesson.id} className="flex items-center gap-2 text-sm p-2 rounded bg-background">
                    <span className="flex-1">{lesson.title}</span>
                    <Button size="sm" variant="ghost" onClick={() => handleDeleteLesson(lesson.id)}><Trash2 className="h-3 w-3" /></Button>
                  </div>
                ))}
                <div className="flex gap-2">
                  <Input placeholder="New lesson title" value={newLessonTitles[mod.id] || ""} onChange={e => setNewLessonTitles({ ...newLessonTitles, [mod.id]: e.target.value })} className="flex-1" />
                  <Button size="sm" onClick={() => handleAddLesson(mod.id)}><Plus className="h-4 w-4" /></Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <div className="flex gap-2">
            <Input placeholder="New module title" value={newModuleTitle} onChange={e => setNewModuleTitle(e.target.value)} className="flex-1" />
            <Button onClick={handleAddModule}><Plus className="h-4 w-4 mr-1" /> Add Module</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
