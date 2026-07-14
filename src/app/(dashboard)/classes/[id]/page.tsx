"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { classesApi } from "@/lib/api"

interface ClassData {
  id: string
  name: string
  section?: string
  gradeLevel?: number
  maxCapacity?: number
  academicYear?: { id: string; name: string }
  classTeacher?: { id: string; user?: { firstName: string; lastName: string } }
  students?: any[]
  classSubjects?: any[]
}

export default function ClassDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [cls, setCls] = React.useState<ClassData | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (params.id) {
      classesApi.get(params.id as string).then((res) => {
        if (res.data) setCls(res.data as ClassData)
        setLoading(false)
      })
    }
  }, [params.id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!cls) return <div className="p-6">Class not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">{cls.name}</h1>
            <p className="text-muted-foreground">
              {cls.section ? `Section ${cls.section}` : "No section"}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/classes/${cls.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Class Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Name</p>
                <p className="font-medium">{cls.name}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Section</p>
                <p className="font-medium">{cls.section || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Grade Level</p>
                <p className="font-medium">{cls.gradeLevel ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Max Capacity</p>
                <p className="font-medium">{cls.maxCapacity ?? "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Academic Year</p>
                <p className="font-medium">{cls.academicYear?.name || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class Teacher</p>
                <p className="font-medium">
                  {cls.classTeacher?.user
                    ? `${cls.classTeacher.user.firstName} ${cls.classTeacher.user.lastName}`
                    : "Unassigned"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Students</CardTitle>
            <CardDescription>{cls.students?.length || 0} enrolled</CardDescription>
          </CardHeader>
          <CardContent>
            {!cls.students || cls.students.length === 0 ? (
              <p className="text-sm text-muted-foreground">No students enrolled</p>
            ) : (
              <div className="space-y-2 max-h-64 overflow-y-auto">
                {cls.students.map((s: any) => (
                  <div key={s.id} className="flex items-center justify-between text-sm">
                    <span>{s.user?.firstName} {s.user?.lastName}</span>
                    <Badge variant="secondary">
                      {s.admissionNumber || "N/A"}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Class Subjects</CardTitle>
          <CardDescription>Subjects assigned to this class</CardDescription>
        </CardHeader>
        <CardContent>
          {!cls.classSubjects || cls.classSubjects.length === 0 ? (
            <p className="text-sm text-muted-foreground">No subjects assigned</p>
          ) : (
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {cls.classSubjects.map((cs: any) => (
                <div key={cs.id} className="flex items-center gap-2 text-sm">
                  <Badge variant="outline">{cs.subject?.name || "Subject"}</Badge>
                  {cs.teacher?.user && (
                    <span className="text-muted-foreground">
                      - {cs.teacher.user.firstName} {cs.teacher.user.lastName}
                    </span>
                  )}
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
