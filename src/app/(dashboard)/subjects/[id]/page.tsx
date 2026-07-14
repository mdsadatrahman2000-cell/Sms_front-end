"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { subjectsApi } from "@/lib/api"

interface Subject {
  id: string
  name: string
  code?: string
  description?: string
  isElective: boolean
  classSubjects: { id: string; class: { id: string; name: string; section?: string } }[]
  courses: { id: string; name: string }[]
}

export default function SubjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [subject, setSubject] = React.useState<Subject | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (params.id) {
      subjectsApi.get(params.id as string).then((res) => {
        if (res.data) setSubject(res.data as Subject)
        setLoading(false)
      })
    }
  }, [params.id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!subject) return <div className="p-6">Subject not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{subject.name}</h1>
            <p className="text-muted-foreground">
              {subject.code ? `Code: ${subject.code}` : "No code assigned"}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/subjects/${subject.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Subject Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{subject.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Code</p>
                <p className="font-medium">{subject.code || "N/A"}</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Type</p>
              <Badge variant={subject.isElective ? "secondary" : "default"}>
                {subject.isElective ? "Elective" : "Core"}
              </Badge>
            </div>
            {subject.description && (
              <div>
                <p className="text-sm text-muted-foreground">Description</p>
                <p className="font-medium">{subject.description}</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Class Assignments</CardTitle>
            <CardDescription>Classes this subject is assigned to</CardDescription>
          </CardHeader>
          <CardContent>
            {subject.classSubjects.length === 0 ? (
              <p className="text-sm text-muted-foreground">Not assigned to any classes</p>
            ) : (
              <div className="space-y-2">
                {subject.classSubjects.map((cs) => (
                  <div key={cs.id} className="flex items-center justify-between text-sm">
                    <span>
                      {cs.class.name}
                      {cs.class.section ? ` - ${cs.class.section}` : ""}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>Courses offered under this subject</CardDescription>
        </CardHeader>
        <CardContent>
          {subject.courses.length === 0 ? (
            <p className="text-sm text-muted-foreground">No courses available</p>
          ) : (
            <div className="space-y-2">
              {subject.courses.map((course) => (
                <div key={course.id} className="flex items-center justify-between text-sm">
                  <span>{course.name}</span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
