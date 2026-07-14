"use client"

import * as React from "react"
import Link from "next/link"
import { Plus, Search, MoreHorizontal, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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
import { studentsApi } from "@/lib/api"

interface Student {
  id: string
  admissionNumber: string
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
  }
  status: string
  createdAt: string
}

export default function StudentsPage() {
  const [students, setStudents] = React.useState<Student[]>([])
  const [loading, setLoading] = React.useState(true)
  const [search, setSearch] = React.useState("")
  const [page, setPage] = React.useState(1)
  const [totalPages, setTotalPages] = React.useState(1)

  const fetchStudents = React.useCallback(async () => {
    setLoading(true)
    const result = await studentsApi.list({ page, limit: 20, search })
    if (result.data) {
      setStudents(result.data.students)
      setTotalPages(result.data.totalPages)
    }
    setLoading(false)
  }, [page, search])

  React.useEffect(() => {
    fetchStudents()
  }, [fetchStudents])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    setPage(1)
    fetchStudents()
  }

  const handleDelete = async (id: string) => {
    if (confirm("Are you sure you want to delete this student?")) {
      await studentsApi.delete(id)
      fetchStudents()
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Students</h1>
          <p className="text-muted-foreground">
            Manage student information and records
          </p>
        </div>
        <Button asChild>
          <Link href="/students/new">
            <Plus className="mr-2 h-4 w-4" />
            Add Student
          </Link>
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            A list of all students in the school
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4 flex items-center gap-2">
            <form onSubmit={handleSearch} className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search students..."
                  className="w-64 pl-8"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
              <Button type="submit" variant="secondary">
                Search
              </Button>
            </form>
          </div>

          <div className="rounded-md border">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Student</TableHead>
                  <TableHead>Admission #</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      Loading...
                    </TableCell>
                  </TableRow>
                ) : students.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="h-24 text-center">
                      No students found
                    </TableCell>
                  </TableRow>
                ) : (
                  students.map((student) => (
                    <TableRow key={student.id}>
                      <TableCell>
                        <div>
                          <p className="font-medium">
                            {student.user.firstName} {student.user.lastName}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {student.user.email}
                          </p>
                        </div>
                      </TableCell>
                      <TableCell>{student.admissionNumber}</TableCell>
                      <TableCell>
                        {student.class
                          ? `${student.class.name}${student.class.section ? ` - ${student.class.section}` : ""}`
                          : "Not assigned"}
                      </TableCell>
                      <TableCell>
                        <Badge variant={student.status === "active" ? "default" : "secondary"}>
                          {student.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon">
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem asChild>
                              <Link href={`/students/${student.id}`}>
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem asChild>
                              <Link href={`/students/${student.id}/edit`}>
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => handleDelete(student.id)}
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

          <div className="flex items-center justify-between mt-4">
            <p className="text-sm text-muted-foreground">
              Page {page} of {totalPages}
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.max(1, page - 1))}
                disabled={page === 1}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage(Math.min(totalPages, page + 1))}
                disabled={page === totalPages}
              >
                Next
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
