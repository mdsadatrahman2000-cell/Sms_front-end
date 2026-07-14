"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Mail, Phone, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { teachersApi } from "@/lib/api"

interface Teacher {
  id: string
  employeeId: string
  department?: string
  designation?: string
  joiningDate?: string
  qualification?: string
  experience?: number
  specialization?: string
  status: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    avatarUrl?: string
  }
}

export default function TeacherDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [teacher, setTeacher] = React.useState<Teacher | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (params.id) {
      teachersApi.get(params.id as string).then((res) => {
        if (res.data) setTeacher(res.data as Teacher)
        setLoading(false)
      })
    }
  }, [params.id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!teacher) return <div className="p-6">Teacher not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {teacher.user.firstName} {teacher.user.lastName}
            </h1>
            <p className="text-muted-foreground">
              Employee #{teacher.employeeId}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/teachers/${teacher.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Teacher Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={teacher.status === "active" ? "default" : "secondary"}>
                  {teacher.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Employee ID</p>
                <p className="font-medium">{teacher.employeeId}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Department</p>
                <p className="font-medium">{teacher.department || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Designation</p>
                <p className="font-medium">{teacher.designation || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Qualification</p>
                <p className="font-medium">{teacher.qualification || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Experience</p>
                <p className="font-medium">{teacher.experience != null ? `${teacher.experience} years` : "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Specialization</p>
                <p className="font-medium">{teacher.specialization || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Joining Date</p>
                <p className="font-medium">
                  {teacher.joiningDate ? new Date(teacher.joiningDate).toLocaleDateString() : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{teacher.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{teacher.user.phone || "N/A"}</span>
            </div>
            <Separator />
            <div className="flex items-center gap-2">
              <Briefcase className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{teacher.designation || "N/A"}</span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
