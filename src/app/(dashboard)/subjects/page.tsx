"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, MoreHorizontal, Edit, Trash2, BookOpen } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { subjectsApi } from "@/lib/api"

interface Subject {
  id: string
  name: string
  code?: string
  description?: string
  isElective: boolean
  _count: {
    classSubjects: number
    courses: number
  }
}

export default function SubjectsPage() {
  const [subjects, setSubjects] = React.useState<Subject[]>([])
  const [loading, setLoading] = React.useState(true)

  const fetchSubjects = React.useCallback(async () => {
    setLoading(true)
    const result = await subjectsApi.list()
    if (result.data) {
      setSubjects(result.data as Subject[])
    }
    setLoading(false)
  }, [])

  React.useEffect(() => {
    fetchSubjects()
  }, [fetchSubjects])

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this subject?")) {
      await subjectsApi.delete(id)
      fetchSubjects()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Subjects</h1>
          <p className="text-muted-foreground">
            Manage subjects and course offerings
          </p>
        </div>
        <Button asChild>
          <Link href="/subjects/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Subject
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{subjects.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Core Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.filter((s) => !s.isElective).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Elective Subjects</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.filter((s) => s.isElective).length}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Courses</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {subjects.reduce((acc, s) => acc + s._count.courses, 0)}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Subject List</CardTitle>
          <CardDescription>
            A list of all subjects in the school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Code</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Classes</TableHead>
                  <TableHead>Courses</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : subjects.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center">
                      No subjects found
                    </TableCell>
                  </TableRow>
                ) : (
                  subjects.map((subject) => (
                    <TableRow key={subject.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">{subject.name}</p>
                          {subject.description && (
                            <p className="text-sm text-muted-foreground line-clamp-1">
                              {subject.description}
                            </p>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{subject.code || "N/A"}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={subject.isElective ? "secondary" : "default"}>
                          {subject.isElective ? "Elective" : "Core"}
                        </Badge>
                      </TableCell>
                      <TableCell>{subject._count.classSubjects}</TableCell>
                      <TableCell>{subject._count.courses}</TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/subjects/${subject.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(subject.id)}
                              className="text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
