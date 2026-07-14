"use client"

import * as React from "react"
import { useParams } from "next/navigation"
import Link from "next/link"
import { ArrowLeft, BookOpen, Layers, FileText } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { lmsApi } from "@/lib/api"

export default function CourseDetailPage() {
  const params = useParams()
  const courseId = params.courseId as string
  const [course, setCourse] = React.useState<any>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    lmsApi.getCourse(courseId).then(res => {
      if (res.data) setCourse(res.data)
      setLoading(false)
    })
  }, [courseId])

  if (loading) return <div className="flex items-center justify-center h-64"><p className="text-muted-foreground">Loading...</p></div>
  if (!course) return <div className="text-center py-8 text-muted-foreground">Course not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href="/lms"><Button variant="ghost" size="sm"><ArrowLeft className="h-4 w-4" /></Button></Link>
        <div className="flex-1">
          <h1 className="text-3xl font-bold tracking-tight">{course.title}</h1>
          <p className="text-muted-foreground">{course.description || "No description"}</p>
        </div>
        <Badge variant={course.status === "published" ? "default" : "secondary"}>{course.status}</Badge>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Subject</CardTitle></CardHeader><CardContent><p className="text-lg font-bold">{course.subject?.name || "-"}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Teacher</CardTitle></CardHeader><CardContent><p className="text-lg font-bold">{course.teacher?.firstName} {course.teacher?.lastName}</p></CardContent></Card>
        <Card><CardHeader className="pb-2"><CardTitle className="text-sm font-medium">Modules</CardTitle></CardHeader><CardContent><p className="text-lg font-bold">{course.modules?.length || 0}</p></CardContent></Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="flex items-center gap-2"><Layers className="h-5 w-5" /> Modules & Lessons</CardTitle>
          <Link href={`/lms/${courseId}/edit`}><Button size="sm">Manage Content</Button></Link>
        </CardHeader>
        <CardContent className="space-y-4">
          {course.modules?.map((mod: any) => (
            <Card key={mod.id} className="bg-muted/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{mod.title}</CardTitle>
                {mod.description && <CardDescription>{mod.description}</CardDescription>}
              </CardHeader>
              <CardContent>
                {mod.lessons?.length > 0 ? (
                  <div className="space-y-2">
                    {mod.lessons.map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center gap-2 text-sm p-2 rounded bg-background">
                        <FileText className="h-4 w-4 text-muted-foreground" />
                        <span className="flex-1">{lesson.title}</span>
                        <Badge variant="outline" className="text-xs">{lesson.contentType}</Badge>
                        {lesson.durationMinutes && <span className="text-xs text-muted-foreground">{lesson.durationMinutes}m</span>}
                      </div>
                    ))}
                  </div>
                ) : <p className="text-sm text-muted-foreground">No lessons yet</p>}
              </CardContent>
            </Card>
          ))}
          {(!course.modules || course.modules.length === 0) && <p className="text-center py-4 text-muted-foreground">No modules yet. Click "Manage Content" to add modules.</p>}
        </CardContent>
      </Card>
    </div>
  )
}
