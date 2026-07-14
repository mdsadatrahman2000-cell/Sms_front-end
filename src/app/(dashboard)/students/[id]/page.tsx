"use client"

import * as React from "react"
import { useRouter, useParams } from "next/navigation"
import { ArrowLeft, Edit, Mail, Phone, Calendar, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { studentsApi } from "@/lib/api"

interface Student {
  id: string
  admissionNumber: string
  rollNumber?: string
  section?: string
  bloodGroup?: string
  medicalConditions?: string
  emergencyContactName?: string
  emergencyContactPhone?: string
  nationality?: string
  previousSchool?: string
  admissionDate?: string
  status: string
  user: {
    id: string
    email: string
    firstName: string
    lastName: string
    phone?: string
    avatarUrl?: string
  }
  class?: {
    id: string
    name: string
    section?: string
    gradeLevel?: number
  }
  attendances: any[]
  marks: any[]
  studentGuardians: any[]
}

export default function StudentDetailPage() {
  const router = useRouter()
  const params = useParams()
  const [student, setStudent] = React.useState<Student | null>(null)
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    if (params.id) {
      studentsApi.get(params.id as string).then((res) => {
        if (res.data) setStudent(res.data as Student)
        setLoading(false)
      })
    }
  }, [params.id])

  if (loading) return <div className="p-6">Loading...</div>
  if (!student) return <div className="p-6">Student not found</div>

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => router.back()}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              {student.user.firstName} {student.user.lastName}
            </h1>
            <p className="text-muted-foreground">
              Admission #{student.admissionNumber}
            </p>
          </div>
        </div>
        <Button onClick={() => router.push(`/students/${student.id}/edit`)}>
          <Edit className="mr-2 h-4 w-4" />
          Edit
        </Button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Student Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Status</p>
                <Badge variant={student.status === "active" ? "default" : "secondary"}>
                  {student.status}
                </Badge>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Class</p>
                <p className="font-medium">
                  {student.class ? `${student.class.name} - ${student.class.section}` : "Unassigned"}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Roll Number</p>
                <p className="font-medium">{student.rollNumber || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Blood Group</p>
                <p className="font-medium">{student.bloodGroup || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Nationality</p>
                <p className="font-medium">{student.nationality || "N/A"}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Previous School</p>
                <p className="font-medium">{student.previousSchool || "N/A"}</p>
              </div>
            </div>
            {student.medicalConditions && (
              <>
                <Separator />
                <div>
                  <p className="text-sm text-muted-foreground">Medical Conditions</p>
                  <p className="font-medium">{student.medicalConditions}</p>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contact</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{student.user.email}</span>
            </div>
            <div className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm">{student.user.phone || "N/A"}</span>
            </div>
            {student.admissionDate && (
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm">Admitted: {new Date(student.admissionDate).toLocaleDateString()}</span>
              </div>
            )}
            <Separator />
            <div>
              <p className="text-sm text-muted-foreground">Emergency Contact</p>
              <p className="font-medium">{student.emergencyContactName || "N/A"}</p>
              <p className="text-sm">{student.emergencyContactPhone || "N/A"}</p>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Recent Attendance</CardTitle>
            <CardDescription>Last 10 attendance records</CardDescription>
          </CardHeader>
          <CardContent>
            {student.attendances.length === 0 ? (
              <p className="text-sm text-muted-foreground">No attendance records</p>
            ) : (
              <div className="space-y-2">
                {student.attendances.slice(0, 10).map((att: any) => (
                  <div key={att.id} className="flex items-center justify-between text-sm">
                    <span>{new Date(att.date).toLocaleDateString()}</span>
                    <Badge variant={att.status === "present" ? "default" : att.status === "absent" ? "destructive" : "secondary"}>
                      {att.status}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recent Marks</CardTitle>
            <CardDescription>Latest exam results</CardDescription>
          </CardHeader>
          <CardContent>
            {student.marks.length === 0 ? (
              <p className="text-sm text-muted-foreground">No marks recorded</p>
            ) : (
              <div className="space-y-2">
                {student.marks.slice(0, 10).map((mark: any) => (
                  <div key={mark.id} className="flex items-center justify-between text-sm">
                    <span>{mark.exam?.name || "Exam"}</span>
                    <span className="font-medium">
                      {mark.marksObtained}/{mark.exam?.totalMarks}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
