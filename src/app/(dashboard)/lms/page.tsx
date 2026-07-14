"use client"

import * as React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { lmsApi } from "@/lib/api"
import { Plus, BookOpen, Layers } from "lucide-react"
import Link from "next/link"

export default function LmsPage() {
  const [courses, setCourses] = React.useState<any[]>([])
  const [loading, setLoading] = React.useState(true)

  React.useEffect(() => {
    lmsApi.courses().then((res) => {
      if (res.data) setCourses((res.data as any).courses || [])
      setLoading(false)
    })
  }, [])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Learning Management</h1>
          <p className="text-muted-foreground">Manage courses, modules, lessons, and assignments</p>
        </div>
        <Link href="/lms/new"><Button><Plus className="h-4 w-4 mr-2" /> New Course</Button></Link>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{courses.length}</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Courses</CardTitle>
          <CardDescription>All courses in the system</CardDescription>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Title</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>Teacher</TableHead>
                <TableHead>Modules</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {courses.map((c: any) => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium"><Link href={`/lms/${c.id}`} className="hover:underline">{c.title}</Link></TableCell>
                  <TableCell>{c.subject?.name || "-"}</TableCell>
                  <TableCell>{c.teacher?.firstName} {c.teacher?.lastName}</TableCell>
                  <TableCell><Badge variant="outline"><Layers className="h-3 w-3 mr-1" /> {c._count?.modules || 0}</Badge></TableCell>
                  <TableCell><Badge variant={c.status === "published" ? "default" : "secondary"}>{c.status}</Badge></TableCell>
                </TableRow>
              ))}
              {courses.length === 0 && !loading && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No courses found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
